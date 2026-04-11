"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLobby } from "@/hooks/useLobby";
import type { GameType } from "@1v1/shared";

const GAME_LABELS: Record<GameType, string> = {
  rps: "Rock Paper Scissors",
  wordle: "Wordle",
};

function resolveGameType(param: string | null): GameType {
  if (param === "wordle") return "wordle";
  return "rps"; // default
}

export default function LobbyPage() {
  const { roomCode, error, createRoom, joinRoom } = useLobby();
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const searchParams = useSearchParams();
  const gameType = resolveGameType(searchParams.get("game"));
  const gameLabel = GAME_LABELS[gameType];

  const ready = playerName.trim().length > 0;

  return (
    <main className="flex flex-col items-center justify-center flex-1 gap-10 p-8">
      <h1 className="text-3xl font-bold">{gameLabel}</h1>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <input
          className="border rounded-lg px-4 py-2 w-full"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <button
          disabled={!ready}
          onClick={() => createRoom(gameType, playerName.trim())}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-blue-700 transition-colors"
        >
          Create Room
        </button>

        <div className="flex gap-2">
          <input
            className="border rounded-lg px-4 py-2 w-32 uppercase"
            placeholder="Code"
            maxLength={6}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button
            disabled={!ready || joinCode.length !== 6}
            onClick={() => joinRoom(joinCode, playerName.trim())}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-green-700 transition-colors"
          >
            Join
          </button>
        </div>
      </div>

      {roomCode && (
        <div className="text-center">
          <p className="text-gray-500">Room created! Share this code:</p>
          <p className="text-4xl font-mono font-bold tracking-widest">{roomCode}</p>
          <p className="text-gray-400 animate-pulse mt-2">Waiting for opponent…</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
