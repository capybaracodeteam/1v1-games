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
} from "@1v1/shared";
import type { RoomManager } from "../rooms/RoomManager.js";
import { RockPaperScissorsEngine } from "../games/RockPaperScissors.js";
import { isGameError } from "../games/GameEngine.js";

const GameActionSchema = z.object({
  roomCode: z.string().min(1).max(10),
  action: z.enum(["rock", "paper", "scissors"]),
});

const GameForfeitSchema = z.object({
  roomCode: z.string().min(1).max(10),
});

const GameRematchSchema = z.object({
  roomCode: z.string().min(1).max(10),
});

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

// Track rematch requests per room
const rematchRequests = new Map<string, Set<string>>();

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
    } else {
      return;
    }

    if (isGameError(result)) {
      socket.emit("game:action_rejected", { reason: result.error });
      return;
    }

    room.gameState = result;
    room.touch();

    // Serialize state per player and emit
    for (const player of room.players) {
      const playerSocket = io.sockets.sockets.get(player.id);
      if (!playerSocket) continue;

      let serialized: unknown;
      if (room.gameType === "rps") {
        serialized = RockPaperScissorsEngine.serializeForPlayer(
          room.gameState as RPSState,
          player.id
        );
      }
      playerSocket.emit("game:state_update", { state: serialized });
    }

    const win = RockPaperScissorsEngine.checkWin(room.gameState as RPSState);
    if (win) {
      room.status = "finished";
      io.to(roomCode).emit("game:over", { winnerId: win.winnerId });
    }
  });

  socket.on("game:forfeit", (payload: GameForfeitPayload) => {
    const parsed = GameForfeitSchema.safeParse(payload);
    if (!parsed.success) return;
    const { roomCode } = parsed.data;

    const room = roomManager.get(roomCode);
    if (!room || room.status !== "playing" || !room.hasPlayer(socket.id)) return;

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

    if (!rematchRequests.has(roomCode)) {
      rematchRequests.set(roomCode, new Set());
    }
    const requests = rematchRequests.get(roomCode)!;
    requests.add(socket.id);

    socket.to(roomCode).emit("game:rematch_requested", { requesterId: socket.id });

    if (requests.size === 2) {
      rematchRequests.delete(roomCode);
      const [p1, p2] = room.players as [typeof room.players[0], typeof room.players[0]];

      if (room.gameType === "rps") {
        room.gameState = RockPaperScissorsEngine.initState([p1, p2]);
      }
      room.status = "playing";
      room.touch();

      io.to(roomCode).emit("game:start", {
        roomCode,
        gameType: room.gameType,
        players: [p1, p2],
      });
    }
  });
}
