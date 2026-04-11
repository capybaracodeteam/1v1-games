import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@1v1/shared";
import type { RoomManager } from "../rooms/RoomManager.js";
import { registerLobbyHandlers } from "./lobbyHandlers.js";
import { registerGameHandlers } from "./gameHandlers.js";

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerAllHandlers(io: IOServer, roomManager: RoomManager): void {
  io.on("connection", (socket: IOSocket) => {
    console.log(`[socket] connected: ${socket.id}`);
    registerLobbyHandlers(io, socket, roomManager);
    registerGameHandlers(io, socket, roomManager);

    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    });
  });
}
