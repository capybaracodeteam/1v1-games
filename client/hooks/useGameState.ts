"use client";

import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";
import { consumePendingGame } from "@/lib/pendingGame";
import type {
  GameOverPayload,
  GameRematchRequestedPayload,
  GameStartPayload,
  RPSState,
} from "@1v1/shared";

function initialRPSState(players: GameStartPayload["players"]): RPSState {
  return {
    playerIds: [players[0].id, players[1].id],
    choices: { [players[0].id]: null, [players[1].id]: null },
    scores: { [players[0].id]: 0, [players[1].id]: 0 },
    roundResult: null,
    round: 1,
  };
}

interface GameState {
  state: unknown;
  gameOver: GameOverPayload | null;
  rematchRequested: boolean;
  players: GameStartPayload["players"] | null;
  gameType: GameStartPayload["gameType"] | null;
}

export function useGameState(roomCode: string) {
  const [game, setGame] = useState<GameState>(() => {
    const pending = consumePendingGame();
    const players = pending?.players ?? null;
    const gameType = pending?.gameType ?? null;
    return {
      // For RPS give an optimistic initial state; for other games wait for the server
      state: (players && gameType === "rps") ? initialRPSState(players) : null,
      gameOver: null,
      rematchRequested: false,
      players,
      gameType,
    };
  });

  useEffect(() => {
    function onStart({ players, gameType }: GameStartPayload) {
      const initialState = gameType === "rps" ? initialRPSState(players) : null;
      setGame({ state: initialState, gameOver: null, rematchRequested: false, players, gameType });
    }

    function onStateUpdate({ state }: { state: unknown }) {
      setGame((prev) => ({ ...prev, state }));
    }

    function onGameOver(payload: GameOverPayload) {
      setGame((prev) => ({ ...prev, gameOver: payload }));
    }

    function onRematchRequested(_payload: GameRematchRequestedPayload) {
      setGame((prev) => ({ ...prev, rematchRequested: true }));
    }

    socket.on("game:start", onStart);
    socket.on("game:state_update", onStateUpdate);
    socket.on("game:over", onGameOver);
    socket.on("game:rematch_requested", onRematchRequested);

    return () => {
      socket.off("game:start", onStart);
      socket.off("game:state_update", onStateUpdate);
      socket.off("game:over", onGameOver);
      socket.off("game:rematch_requested", onRematchRequested);
    };
  }, []);

  const sendAction = useCallback(
    (action: string) => {
      socket.emit("game:action", { roomCode, action });
    },
    [roomCode]
  );

  const forfeit = useCallback(() => {
    socket.emit("game:forfeit", { roomCode });
  }, [roomCode]);

  const requestRematch = useCallback(() => {
    socket.emit("game:rematch", { roomCode });
  }, [roomCode]);

  return { ...game, sendAction, forfeit, requestRematch };
}
