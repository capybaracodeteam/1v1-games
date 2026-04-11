import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type { ClientToServerEvents, ServerToClientEvents } from "@1v1/shared";
import { config } from "./config.js";
import { RoomManager } from "./rooms/RoomManager.js";
import { registerAllHandlers } from "./socket/index.js";

const app = express();
app.use(cors({ origin: config.CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: config.NODE_ENV });
});

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: config.CLIENT_ORIGIN },
  transports: ["websocket"],
});

const roomManager = new RoomManager();
registerAllHandlers(io, roomManager);

httpServer.listen(config.PORT, () => {
  console.log(`[server] listening on port ${config.PORT} (${config.NODE_ENV})`);
});
