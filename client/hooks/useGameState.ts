"use client";

import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";
import { consumePendingGame } from "@/lib/pendingGame";
import type {
  GameOverPayload,
  GameStartPayload,
  RPSState,
} from "@1v1/shared";

function initialRPSState(players: GameStartPayload["players"]): RPSState {
  return {
    playerIds: [players[0].id, players[1].id],
    choices: { [players[0].id]: null, [players[1].id]: null },
    hearts: { [players[0].id]: 3, [players[1].id]: 3 },
    roundResult: null,
    round: 1,
  };
}

interface GameState {
  state: unknown;
  gameOver: GameOverPayload | null;
  players: GameStartPayload["players"] | null;
  gameType: GameStartPayload["gameType"] | null;
  gameVersion: number;
}

export function useGameState(roomCode: string) {
  const [game, setGame] = useState<GameState>(() => {
    const pending = consumePendingGame();
    const players = pending?.players ?? null;
    const gameType = pending?.gameType ?? null;
    const pendingInitialState = pending?.initialState ?? null;
    return {
      state: (players && gameType === "rps") ? initialRPSState(players) : pendingInitialState,
      gameOver: null,
      players,
      gameType,
      gameVersion: 0,
    };
  });

  useEffect(() => {
    function onStart({ players, gameType, initialState }: GameStartPayload) {
      const state = gameType === "rps" ? initialRPSState(players) : (initialState ?? null);
      setGame((prev) => ({ state, gameOver: null, players, gameType, gameVersion: prev.gameVersion + 1 }));
    }

    function onStateUpdate({ state }: { state: unknown }) {
      setGame((prev) => ({ ...prev, state }));
    }

    function onGameOver(payload: GameOverPayload) {
      setGame((prev) => ({ ...prev, gameOver: payload }));
    }

    socket.on("game:start", onStart);
    socket.on("game:state_update", onStateUpdate);
    socket.on("game:over", onGameOver);

    return () => {
      socket.off("game:start", onStart);
      socket.off("game:state_update", onStateUpdate);
      socket.off("game:over", onGameOver);
    };
  }, []);

  const sendAction = useCallback(
    (action: string) => {
      socket.emit("game:action", { roomCode, action });
    },
    [roomCode]
  );

  const leave = useCallback(() => {
    socket.emit("lobby:leave", { roomCode });
  }, [roomCode]);

  const requestRematch = useCallback(() => {
    socket.emit("game:rematch", { roomCode });
  }, [roomCode]);

  return { ...game, sendAction, leave, requestRematch };
}
