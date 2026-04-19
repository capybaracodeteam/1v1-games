import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  LobbyCreatePayload,
  LobbyJoinPayload,
  LobbyLeavePayload,
} from "@1v1/shared";
import type { RoomManager } from "../rooms/RoomManager.js";
import { RockPaperScissorsEngine } from "../games/RockPaperScissors.js";
import { WordleEngine } from "../games/WordleEngine.js";
import { TetrisEngine, type TetrisState } from "../games/TetrisEngine.js";
import { startWordleHpInterval } from "./gameHandlers.js";

const LobbyCreateSchema = z.object({
  gameType: z.enum(["rps", "wordle", "tetris"]),
  playerName: z.string().min(1).max(20),
});

const LobbyJoinSchema = z.object({
  roomCode: z.string().min(1).max(10),
  playerName: z.string().min(1).max(20),
});

const LobbyLeaveSchema = z.object({
  roomCode: z.string().min(1).max(10),
});

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerLobbyHandlers(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager
): void {
  socket.on("lobby:create", (payload: LobbyCreatePayload) => {
    const parsed = LobbyCreateSchema.safeParse(payload);
    if (!parsed.success) return;
    const { gameType, playerName } = parsed.data;

    const room = roomManager.create(gameType);
    room.players.push({ id: socket.id, name: playerName });
    room.touch();
    socket.join(room.code);
    socket.emit("lobby:created", { roomCode: room.code });
  });

  socket.on("lobby:join", (payload: LobbyJoinPayload) => {
    const parsed = LobbyJoinSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomCode, playerName } = parsed.data;

    const room = roomManager.get(roomCode);

    if (!room) {
      socket.emit("lobby:joined", { roomCode, players: [] });
      return;
    }
    if (room.isFull()) return;
    if (room.hasPlayer(socket.id)) return;

    room.players.push({ id: socket.id, name: playerName });
    room.touch();
    socket.join(roomCode);

    socket.emit("lobby:joined", { roomCode, players: room.players });
    socket.to(roomCode).emit("lobby:opponent_joined", {
      opponent: { id: socket.id, name: playerName },
    });

    if (room.isFull() && room.status === "waiting") {
      room.status = "playing";
      const [p1, p2] = room.players as [typeof room.players[0], typeof room.players[0]];

      if (room.gameType === "rps") {
        room.gameState = RockPaperScissorsEngine.initState([p1, p2]);
      } else if (room.gameType === "wordle") {
        room.gameState = WordleEngine.initState([p1, p2]);
        startWordleHpInterval(io, room, roomCode, roomManager);
      } else if (room.gameType === "tetris") {
        room.gameState = TetrisEngine.initState([p1, p2]);
      }

      for (const player of room.players) {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (!playerSocket) continue;
        const initialState = room.gameType === "tetris"
          ? TetrisEngine.serializeForPlayer(room.gameState as TetrisState, player.id)
          : undefined;
        playerSocket.emit("game:start", {
          roomCode,
          gameType: room.gameType,
          players: [p1, p2],
          initialState,
        });
      }
    }
  });

  socket.on("lobby:leave", (payload: LobbyLeavePayload) => {
    const parsed = LobbyLeaveSchema.safeParse(payload);
    if (!parsed.success) return;
    handleLeave(io, socket, roomManager, parsed.data.roomCode);
  });

  socket.on("disconnect", () => {
    for (const roomCode of socket.rooms) {
      if (roomCode !== socket.id) {
        handleLeave(io, socket, roomManager, roomCode);
      }
    }
  });

  socket.on("lobby:ping", () => {
    socket.emit("lobby:pong");
  });
}

function handleLeave(
  io: IOServer,
  socket: IOSocket,
  roomManager: RoomManager,
  roomCode: string
): void {
  const room = roomManager.get(roomCode);
  if (!room) return;

  room.removePlayer(socket.id);
  socket.leave(roomCode);

  if (room.players.length === 0) {
    roomManager.delete(roomCode);
  } else {
    io.to(roomCode).emit("lobby:opponent_left", { opponentId: socket.id });
  }
}
