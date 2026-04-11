import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@1v1/shared";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

// Singleton socket — created once, never auto-connects.
// Call socket.connect() explicitly (managed by SocketContext).
export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ["websocket"],
}) as Socket<ServerToClientEvents, ClientToServerEvents>;
