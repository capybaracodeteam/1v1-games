"use client";

import type { RPSState, RPSChoice } from "@1v1/shared";

const CHOICES: RPSChoice[] = ["rock", "paper", "scissors"];
const EMOJI: Record<RPSChoice, string> = { rock: "✊", paper: "✋", scissors: "✌️" };

interface Props {
  state: RPSState;
  myId: string;
  onChoice: (choice: RPSChoice) => void;
}

export default function RockPaperScissors({ state, myId, onChoice }: Props) {
  const myChoice = state.choices[myId];
  const opponentId = Object.keys(state.choices).find((id) => id !== myId) ?? "";
  const opponentChoice = state.choices[opponentId];
  const myScore = state.scores[myId] ?? 0;
  const opponentScore = state.scores[opponentId] ?? 0;
  const waiting = myChoice !== null && opponentChoice === null;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="text-2xl font-bold">
        Round {state.round} — Score: {myScore} : {opponentScore}
      </div>

      {state.roundResult && (
        <div className="text-lg text-center">
          {state.roundResult.winner === myId
            ? "You won this round!"
            : state.roundResult.winner === null
            ? "Draw!"
            : "Opponent won this round."}
          <div className="text-sm text-gray-500 mt-1">
            You: {EMOJI[state.roundResult.choices[myId]]}
            {" vs "}
            Opponent: {EMOJI[state.roundResult.choices[opponentId]]}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            onClick={() => onChoice(choice)}
            disabled={myChoice !== null}
            className="text-5xl p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {EMOJI[choice]}
          </button>
        ))}
      </div>

      {waiting && (
        <p className="text-gray-500 animate-pulse">Waiting for opponent…</p>
      )}
    </div>
  );
}
