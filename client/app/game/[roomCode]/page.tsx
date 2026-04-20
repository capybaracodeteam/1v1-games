"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useGameState } from "@/hooks/useGameState";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import Wordle from "@/components/games/Wordle";
import Tetris from "@/components/games/Tetris";
import type { RPSState, WordleState, TetrisSerializedState } from "@1v1/shared";

export default function GamePage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { state, gameType, gameOver, players, gameVersion, sendAction, leave, requestRematch } =
    useGameState(roomCode);

  const myId = socket.id ?? "";
  const opponent = players?.find((p) => p.id !== myId);

  if (!players) {
    return (
      <main className="flex items-center justify-center flex-1 p-8 bg-background">
        <p className="text-foreground/40 animate-pulse tracking-wide">Loading game…</p>
      </main>
    );
  }

  function renderGame() {
    if (gameType === "rps") {
      return <RockPaperScissors state={state as RPSState} myId={myId} onChoice={sendAction} />;
    }
    if (gameType === "wordle") {
      if (!state) return <p className="text-gray-400 animate-pulse">Connecting…</p>;
      return <Wordle state={state as WordleState} myId={myId} onChoice={sendAction} />;
    }
    if (gameType === "tetris") {
      return (
        <Tetris
          key={gameVersion}
          serverState={state as TetrisSerializedState | null}
          myId={myId}
          onAction={sendAction}
        />
      );
    }
    return <div className="text-gray-400">Unknown game type: {gameType}</div>;
  }

  return (
    <main className="flex flex-col items-center flex-1 gap-6 p-8 bg-background">
      <div className="font-bebas text-lg tracking-widest text-foreground/50">
        {roomCode}
        {opponent && <span className="ml-4 text-accent/70">vs {opponent.name}</span>}
      </div>

      {gameOver ? (
        <div className="flex flex-col items-center gap-8 text-center py-12">
          {(() => {
            const isWin = gameOver.winnerId === myId;
            const isDraw = gameOver.winnerId === null;
            const label = isWin ? "You Won!" : isDraw ? "Draw!" : gameOver.forfeit ? "Opponent Forfeited." : "You Lost.";
            return (
              <h2
                className="font-bebas leading-none"
                style={
                  isWin
                    ? { fontSize: "6rem", color: "#F5C518", textShadow: "0 0 40px #F5C518, 0 0 80px #F5C51866" }
                    : isDraw
                    ? { fontSize: "6rem", color: "#f0f0f0", textShadow: "0 0 30px #f0f0f044" }
                    : { fontSize: "6rem", color: "#f0f0f099" }
                }
              >
                {label}
              </h2>
            );
          })()}
          <div className="h-px w-48 bg-accent/30" />
          <div className="flex gap-4">
            <button
              onClick={requestRematch}
              className="px-8 py-3 bg-accent text-black font-bebas text-xl tracking-wider rounded-xl hover:shadow-[0_0_20px_-4px_#F5C518] transition-all duration-200"
            >
              Rematch
            </button>
            <button
              onClick={() => { leave(); router.push('/'); }}
              className="px-8 py-3 border border-white/20 text-foreground/70 font-bebas text-xl tracking-wider rounded-xl hover:border-white/40 hover:text-foreground transition-all duration-200"
            >
              Leave
            </button>
          </div>
        </div>
      ) : (
        <>
          {renderGame()}
        </>
      )}
    </main>
  );
}
