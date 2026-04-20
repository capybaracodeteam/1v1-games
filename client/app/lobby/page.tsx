"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLobby } from "@/hooks/useLobby";
import type { GameType } from "@1v1/shared";

const GAME_LABELS: Record<GameType, string> = {
  rps: "RPS",
  wordle: "Wordle",
  tetris: "Tetris",
};

function resolveGameType(param: string | null): GameType {
  if (param === "wordle") return "wordle";
  if (param === "tetris") return "tetris";
  return "rps"; // default
}

function LobbyContent() {
  const { roomCode, error, createRoom, joinRoom } = useLobby();
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const searchParams = useSearchParams();
  const gameType = resolveGameType(searchParams.get("game"));
  const gameLabel = GAME_LABELS[gameType];

  const ready = playerName.trim().length > 0;

  return (
    <main className="flex flex-col items-center justify-center flex-1 gap-10 px-6 py-16 bg-background">

      <div className="text-center space-y-2">
        <h1 className="font-bebas text-6xl sm:text-7xl text-foreground leading-none">{gameLabel}</h1>
        <div className="h-px w-32 bg-accent/30 mx-auto" />
        <p className="font-bebas text-lg tracking-[0.3em] text-foreground/60 uppercase">Instructions</p>
        <div className="h-px w-32 bg-accent/30 mx-auto" />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/60 focus:shadow-[0_0_12px_-2px_#F5C51844] transition-all"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <button
          disabled={!ready}
          onClick={() => createRoom(gameType, playerName.trim())}
          className="w-full px-6 py-3 bg-accent text-black font-bebas text-xl tracking-wider rounded-xl disabled:opacity-30 hover:shadow-[0_0_20px_-4px_#F5C518] transition-all duration-200"
        >
          Create Room
        </button>

        <div className="flex gap-2 w-full">
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full uppercase text-center text-foreground placeholder:text-foreground/40 tracking-widest focus:outline-none focus:border-accent/60 focus:shadow-[0_0_12px_-2px_#F5C51844] transition-all"
            placeholder="Room Code"
            maxLength={6}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button
            disabled={!ready || joinCode.length !== 6}
            onClick={() => joinRoom(joinCode, playerName.trim())}
            className="px-6 py-3 border border-accent/60 text-accent font-bebas text-xl tracking-wider rounded-xl disabled:opacity-30 hover:bg-accent/10 hover:shadow-[0_0_20px_-4px_#F5C51844] transition-all duration-200"
          >
            Join
          </button>
        </div>
      </div>

      {roomCode && (
        <div className="text-center space-y-2">
          <div className="h-px w-48 bg-accent/30 mx-auto" />
          <p className="font-bebas text-lg tracking-[0.3em] text-foreground/60 uppercase">Share This Code</p>
          <p
            className="font-bebas text-6xl text-accent tracking-widest leading-none"
            style={{ textShadow: "0 0 30px #F5C518, 0 0 60px #F5C51866" }}
          >
            {roomCode}
          </p>
          <p className="text-foreground/40 animate-pulse mt-2 tracking-wide">Waiting for opponent…</p>
          <div className="h-px w-48 bg-accent/30 mx-auto" />
        </div>
      )}

      {error && <p className="text-accent/80 tracking-wide">{error}</p>}
    </main>
  );
}

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyContent />
    </Suspense>
  );
}
