"use client";

import type { RPSState, RPSChoice } from "@1v1/shared";

const CHOICES: RPSChoice[] = ["rock", "paper", "scissors"];
const EMOJI: Record<RPSChoice, string> = { rock: "✊", paper: "✋", scissors: "✌️" };

interface Props {
  state: RPSState;
  myId: string;
  onChoice: (choice: RPSChoice) => void;
}

function Hearts({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="text-2xl">{i < count ? "❤️" : "🖤"}</span>
      ))}
    </div>
  );
}

export default function RockPaperScissors({ state, myId, onChoice }: Props) {
  const myChoice = state.choices[myId];
  const opponentId = Object.keys(state.choices).find((id) => id !== myId) ?? "";
  const opponentChoice = state.choices[opponentId];
  const myHearts = state.hearts[myId] ?? 3;
  const oppHearts = state.hearts[opponentId] ?? 3;
  const waiting = myChoice !== null && opponentChoice === null;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto px-2 py-8">

      {/* Hearts */}
      <div className="flex items-center gap-6">
        <Hearts count={myHearts} />
        <span className="font-bebas text-2xl text-foreground/30 tracking-widest">VS</span>
        <Hearts count={oppHearts} />
      </div>

      {/* Round */}
      <div className="font-bebas text-xl tracking-widest text-foreground/50">
        ROUND {state.round}
      </div>

      {/* Round result */}
      {state.roundResult && (
        <div className="text-center flex flex-col gap-1">
          <div
            className="font-bebas text-4xl"
            style={{
              color:
                state.roundResult.winner === myId
                  ? "#F5C518"
                  : state.roundResult.winner === null
                  ? "#f0f0f0"
                  : "#f0f0f0",
              textShadow:
                state.roundResult.winner === myId
                  ? "0 0 20px #F5C518, 0 0 40px #F5C51866"
                  : undefined,
            }}
          >
            {state.roundResult.winner === myId
              ? "You Won!"
              : state.roundResult.winner === null
              ? "Draw!"
              : "Opponent Won"}
          </div>
          <div className="text-foreground/50 text-sm">
            You: {EMOJI[state.roundResult.choices[myId]]}
            {" vs "}
            Opponent: {EMOJI[state.roundResult.choices[opponentId]]}
          </div>
        </div>
      )}

      {/* Choice buttons */}
      <div className="flex gap-2 sm:gap-6 w-full">
        {CHOICES.map((choice) => {
          const isSelected = myChoice === choice;
          const isDisabled = myChoice !== null && !isSelected;

          return (
            <button
              key={choice}
              onClick={() => onChoice(choice)}
              disabled={myChoice !== null}
              className={[
                "flex items-center justify-center flex-1 aspect-square",
                "rounded-2xl border-2 transition-all duration-200",
                isSelected
                  ? "border-accent bg-accent/10"
                  : isDisabled
                  ? "border-white/10 bg-white/5 opacity-30 cursor-not-allowed"
                  : "border-white/20 bg-white/5 hover:border-accent/60 hover:bg-accent/5 cursor-pointer",
              ].join(" ")}
              style={
                isSelected
                  ? { boxShadow: "0 0 24px #F5C51866" }
                  : undefined
              }
            >
              <span className="text-6xl sm:text-8xl md:text-9xl">{EMOJI[choice]}</span>
            </button>
          );
        })}
      </div>

      {waiting && (
        <p className="font-bebas text-lg tracking-widest text-foreground/50 animate-pulse">
          WAITING FOR OPPONENT…
        </p>
      )}
    </div>
  );
}
