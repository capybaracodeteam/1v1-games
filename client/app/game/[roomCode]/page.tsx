"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useGameState } from "@/hooks/useGameState";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import Wordle from "@/components/games/Wordle";
import type { RPSState, WordleState } from "@1v1/shared";

export default function GamePage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { state, gameType, gameOver, players, sendAction, leave, requestRematch } =
    useGameState(roomCode);

  const myId = socket.id ?? "";
  const opponent = players?.find((p) => p.id !== myId);

  if (!players) {
    return (
      <main className="flex items-center justify-center flex-1 p-8">
        <p className="text-gray-400 animate-pulse">Loading game…</p>
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
    return <div className="text-gray-400">Unknown game type: {gameType}</div>;
  }

  return (
    <main className="flex flex-col items-center flex-1 gap-6 p-8">
      <div className="text-lg font-semibold">
        Room: <span className="font-mono">{roomCode}</span>
        {opponent && <span className="ml-4 text-gray-500">vs {opponent.name}</span>}
      </div>

      {gameOver ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold">
            {gameOver.winnerId === myId
              ? "You won!"
              : gameOver.winnerId === null
              ? "Draw!"
              : gameOver.forfeit
              ? "Opponent forfeited."
              : "You lost."}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={requestRematch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              Rematch
            </button>
            <button
              onClick={() => { leave(); router.push('/'); }}
              className="px-6 py-3 border rounded-xl font-semibold hover:bg-gray-100"
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
