"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { setPendingGame } from "@/lib/pendingGame";
import type {
  GameType,
  GameStartPayload,
  LobbyCreatedPayload,
  LobbyJoinedPayload,
} from "@1v1/shared";

interface LobbyState {
  roomCode: string | null;
  error: string | null;
}

export function useLobby() {
  const router = useRouter();
  const { connect, status } = useSocket();
  const [state, setState] = useState<LobbyState>({ roomCode: null, error: null });

  useEffect(() => {
    function onCreated({ roomCode }: LobbyCreatedPayload) {
      setState({ roomCode, error: null });
    }

    function onJoined({ roomCode, players }: LobbyJoinedPayload) {
      if (players.length === 0) {
        setState({ roomCode: null, error: "Room not found" });
        return;
      }
      setState({ roomCode, error: null });
    }

    function onGameStart(payload: GameStartPayload) {
      setPendingGame(payload);
      router.push(`/game/${payload.roomCode}`);
    }

    socket.on("lobby:created", onCreated);
    socket.on("lobby:joined", onJoined);
    socket.on("game:start", onGameStart);

    return () => {
      socket.off("lobby:created", onCreated);
      socket.off("lobby:joined", onJoined);
      socket.off("game:start", onGameStart);
    };
  }, [router]);

  const createRoom = useCallback(
    (gameType: GameType, playerName: string) => {
      if (status !== "connected") connect();
      // Emit after ensuring connection (socket queues if not yet connected)
      socket.emit("lobby:create", { gameType, playerName });
    },
    [status, connect]
  );

  const joinRoom = useCallback(
    (roomCode: string, playerName: string) => {
      if (status !== "connected") connect();
      socket.emit("lobby:join", { roomCode: roomCode.toUpperCase(), playerName });
    },
    [status, connect]
  );

  return { ...state, createRoom, joinRoom };
}
