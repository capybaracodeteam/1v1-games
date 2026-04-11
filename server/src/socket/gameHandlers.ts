import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  GameActionPayload,
  GameForfeitPayload,
  GameRematchPayload,
  RPSState,
  RPSChoice,
  WordleState,
} from "@1v1/shared";
import type { RoomManager } from "../rooms/RoomManager.js";
import type { Room } from "../rooms/Room.js";
import { RockPaperScissorsEngine } from "../games/RockPaperScissors.js";
import { WordleEngine } from "../games/WordleEngine.js";
import { isGameError } from "../games/GameEngine.js";

const GameActionSchema = z.object({
  roomCode: z.string().min(1).max(10),
  action: z.string().min(1).max(10),
});

const GameForfeitSchema = z.object({
  roomCode: z.string().min(1).max(10),
});

const GameRematchSchema = z.object({
  roomCode: z.string().min(1).max(10),
});

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;


function emitGameState(io: IOServer, room: Room): void {
  for (const player of room.players) {
    const playerSocket = io.sockets.sockets.get(player.id);
    if (!playerSocket) continue;

    let serialized: unknown;
    if (room.gameType === "rps") {
      serialized = RockPaperScissorsEngine.serializeForPlayer(room.gameState as RPSState, player.id);
    } else if (room.gameType === "wordle") {
      serialized = WordleEngine.serializeForPlayer(room.gameState as WordleState, player.id);
    }
    if (serialized !== undefined) {
      playerSocket.emit("game:state_update", { state: serialized });
    }
  }
}

export function startWordleHpInterval(
  io: IOServer,
  room: Room,
  roomCode: string,
  roomManager: RoomManager
): void {
  room.clearGameInterval();
  room.gameInterval = setInterval(() => {
    if (room.status !== "playing") return;
    const state = room.gameState as WordleState;
    const now = Date.now();
    const elapsed = Math.floor((now - state.lastHpTick) / 1000);

    // Advance any rounds that completed last tick
    const players = { ...state.players };
    for (const pid of state.playerIds) {
      if (players[pid].roundComplete) {
        const nextIndex = Math.min(players[pid].wordIndex + 1, state.wordSequence.length - 1);
        players[pid] = {
          wordIndex: nextIndex,
          currentWord: state.wordSequence[nextIndex] ?? "",
          guesses: [],
          roundComplete: false,
        };
      }
    }

    // Apply HP decay
    const hp = { ...state.hp };
    for (const pid of state.playerIds) {
      hp[pid] = Math.max(0, hp[pid] - elapsed);
    }

    const newState: WordleState = {
      ...state,
      players,
      hp,
      lastHpTick: state.lastHpTick + elapsed * 1000,
    };
    room.gameState = newState;
    room.touch();

    emitGameState(io, room);

    const win = WordleEngine.checkWin(newState);
    if (win) {
      room.clearGameInterval();
      room.status = "finished";
      io.to(roomCode).emit("game:over", { winnerId: win.winnerId });
      roomManager.delete(roomCode);
    }
  }, 1000);
}

export function registerGameHandlers(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager
): void {
  socket.on("game:action", (payload: GameActionPayload) => {
    const parsed = GameActionSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomCode, action } = parsed.data;

    const room = roomManager.get(roomCode);
    if (!room || room.status !== "playing" || !room.hasPlayer(socket.id)) return;

    let result: unknown;

    if (room.gameType === "rps") {
      result = RockPaperScissorsEngine.applyAction(
        room.gameState as RPSState,
        action as RPSChoice,
        socket.id
      );
    } else if (room.gameType === "wordle") {
      result = WordleEngine.applyAction(room.gameState as WordleState, action, socket.id);
    } else {
      return;
    }

    if (isGameError(result)) {
      socket.emit("game:action_rejected", { reason: result.error });
      return;
    }

    room.gameState = result;
    room.touch();

    emitGameState(io, room);

    if (room.gameType === "rps") {
      const win = RockPaperScissorsEngine.checkWin(room.gameState as RPSState);
      if (win) {
        room.status = "finished";
        io.to(roomCode).emit("game:over", { winnerId: win.winnerId });
      }
    } else if (room.gameType === "wordle") {
      const win = WordleEngine.checkWin(room.gameState as WordleState);
      if (win) {
        room.clearGameInterval();
        room.status = "finished";
        io.to(roomCode).emit("game:over", { winnerId: win.winnerId });
        roomManager.delete(roomCode);
      }
    }
  });

  socket.on("game:forfeit", (payload: GameForfeitPayload) => {
    const parsed = GameForfeitSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomCode } = parsed.data;

    const room = roomManager.get(roomCode);
    if (!room || room.status !== "playing" || !room.hasPlayer(socket.id)) return;

    room.clearGameInterval();
    room.status = "finished";
    room.touch();
    io.to(roomCode).emit("game:over", { winnerId: null, forfeit: true });
  });

  socket.on("game:rematch", (payload: GameRematchPayload) => {
    const parsed = GameRematchSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomCode } = parsed.data;

    const room = roomManager.get(roomCode);
    if (!room || room.status !== "finished" || !room.hasPlayer(socket.id)) return;

    const [p1, p2] = room.players as [typeof room.players[0], typeof room.players[0]];

    if (room.gameType === "rps") {
      room.gameState = RockPaperScissorsEngine.initState([p1, p2]);
    } else if (room.gameType === "wordle") {
      room.gameState = WordleEngine.initState([p1, p2]);
      startWordleHpInterval(io, room, roomCode, roomManager);
    }

    room.status = "playing";
    room.touch();

    io.to(roomCode).emit("game:start", {
      roomCode,
      gameType: room.gameType,
      players: [p1, p2],
    });
  });
}
