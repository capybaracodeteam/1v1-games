"use client";

import { useState, useEffect, useCallback } from "react";
import type { WordleState, WordleGuess, LetterResult } from "@1v1/shared";

interface Props {
  state: WordleState;
  myId: string;
  onChoice: (word: string) => void;
}

const TILE_COLORS: Record<LetterResult, string> = {
  correct: "bg-green-600 text-white border-green-600",
  present: "bg-yellow-500 text-white border-yellow-500",
  absent:  "bg-white/15 text-white border-white/15",
};

const KEY_COLORS: Record<LetterResult | "unused", string> = {
  correct: "bg-green-600 text-white",
  present: "bg-yellow-500 text-black",
  absent:  "bg-white/[0.06] text-foreground/30",
  unused:  "bg-white/20 text-foreground",
};

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

function getLetterStates(guesses: WordleGuess[]): Record<string, LetterResult> {
  const states: Record<string, LetterResult> = {};
  for (const guess of guesses) {
    for (let i = 0; i < guess.word.length; i++) {
      const letter = guess.word[i];
      if (!letter) continue;
      const result = guess.result[i];
      const current = states[letter];
      if (current === "correct") continue;
      if (!current || result === "correct" || (result === "present" && current === "absent")) {
        states[letter] = result;
      }
    }
  }
  return states;
}

function HpBar({ hp, label }: { hp: number; label: string }) {
  const clampedHp = Math.max(0, Math.min(200, hp));
  // Red bar: 100 HP = full bar width (0–100%)
  // Blue overheal: overlays from left when HP > 100 (each +1 HP = +1%)
  const redPct  = Math.min(clampedHp, 100);       // 0% – 100%
  const bluePct = Math.max(0, clampedHp - 100);   // 0% – 100%

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bebas tracking-widest text-foreground/70">{label}</span>
        <span className="font-bebas text-accent">{Math.round(clampedHp)} HP</span>
      </div>
      <div className="relative w-full h-3 bg-white/10 rounded overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-200"
          style={{ width: `${redPct}%` }}
        />
        {clampedHp > 100 && (
          <div
            className="absolute left-0 top-0 h-full bg-blue-400 transition-all duration-200"
            style={{ width: `${bluePct}%` }}
          />
        )}
      </div>
    </div>
  );
}

function TileRow({ guess, currentInput, isEmpty }: {
  guess?: WordleGuess;
  currentInput?: string;
  isEmpty?: boolean;
}) {
  const cells = Array(5).fill(null);
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {cells.map((_, i) => {
        if (guess) {
          const letter = guess.word[i] ?? "";
          const result = guess.result[i];
          const color = letter ? (result ? TILE_COLORS[result] : "bg-white/5 border-white/20 text-foreground") : "bg-transparent border-white/[0.07]";
          return (
            <div
              key={i}
              className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 font-bold text-sm sm:text-xl uppercase ${color}`}
            >
              {letter}
            </div>
          );
        }
        if (currentInput !== undefined) {
          const letter = currentInput[i] ?? "";
          return (
            <div
              key={i}
              className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 font-bold text-sm sm:text-xl uppercase text-foreground ${letter ? "border-accent/80 bg-white/10" : "border-white/50 bg-white/[0.08]"}`}
            >
              {letter}
            </div>
          );
        }
        return (
          <div key={i} className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-white/[0.07] bg-transparent" />
        );
      })}
    </div>
  );
}

function MiniTileRow({ guess }: { guess?: WordleGuess }) {
  return (
    <div className="flex gap-0.5 sm:gap-1">
      {Array(5).fill(null).map((_, i) => {
        const result = guess?.result[i];
        const color = result ? TILE_COLORS[result] : "bg-white/20";
        return <div key={i} className={`w-4 h-4 sm:w-6 sm:h-6 ${color}`} />;
      })}
    </div>
  );
}

export default function Wordle({ state, myId, onChoice }: Props) {
  const opponentId = state.playerIds.find((id) => id !== myId) ?? "";
  const myState = state.players[myId];
  const oppState = state.players[opponentId];

  const [currentInput, setCurrentInput] = useState("");

  // HP interpolation — re-render every 200ms so the bar animates smoothly
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, []);

  const elapsedSec = Math.floor((now - state.lastHpTick) / 1500);
  const myHp   = Math.max(0, (state.hp[myId]       ?? 0) - elapsedSec);
  const oppHp  = Math.max(0, (state.hp[opponentId] ?? 0) - elapsedSec);

  // Reset input when word advances (round cleared)
  useEffect(() => {
    setCurrentInput("");
  }, [myState?.wordIndex]);

  const submitGuess = useCallback(() => {
    if (currentInput.length !== 5) return;
    onChoice(currentInput);
    setCurrentInput("");
  }, [currentInput, onChoice]);

  useEffect(() => {
    if (myState?.roundComplete) return; // can't type when waiting for next word

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        submitGuess();
      } else if (e.key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        setCurrentInput((prev) => (prev.length < 5 ? prev + e.key.toUpperCase() : prev));
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [myState?.roundComplete, submitGuess]);

  const letterStates = getLetterStates(myState?.guesses ?? []);

  const handleKeyClick = (key: string) => {
    if (myState?.roundComplete) return;
    if (key === "ENTER") {
      submitGuess();
    } else if (key === "⌫") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else {
      setCurrentInput((prev) => (prev.length < 5 ? prev + key : prev));
    }
  };

  // Build the 6-row grid
  const rows = Array(6).fill(null).map((_, i) => {
    const guess = myState?.guesses[i];
    const isCurrentRow = !myState?.roundComplete && i === (myState?.guesses.length ?? 0);
    return { guess, isCurrentRow };
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
      {/* HP bars */}
      <div className="flex gap-6 w-full">
        <div className="flex-1">
          <HpBar hp={myHp} label="You" />
        </div>
        <div className="flex-1">
          <HpBar hp={oppHp} label="Opponent" />
        </div>
      </div>

      {/* Word index indicator */}
      <div className="font-bebas text-sm tracking-widest text-foreground/40">
        Word {(myState?.wordIndex ?? 0) + 1} / {state.wordSequence.length || 15}
      </div>

      {/* Main layout: my board + opponent mini-board */}
      <div className="flex gap-8 items-start">
        {/* My board */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {myState?.roundComplete ? (
            <p className="font-bebas text-sm tracking-widest text-accent/60 mb-2 text-center animate-pulse">Next word coming…</p>
          ) : null}
          {rows.map(({ guess, isCurrentRow }, i) => (
            <TileRow
              key={i}
              guess={guess}
              currentInput={isCurrentRow ? currentInput : undefined}
            />
          ))}
        </div>

        {/* Opponent mini-board */}
        <div className="flex flex-col gap-0.5 sm:gap-1 mt-6">
          <p className="font-bebas text-xs tracking-widest text-foreground/40 mb-1 text-center">
            Opp (word {(oppState?.wordIndex ?? 0) + 1})
          </p>
          {Array(6).fill(null).map((_, i) => (
            <MiniTileRow key={i} guess={oppState?.guesses[i]} />
          ))}
        </div>
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1 mt-2">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map((key) => {
              const letterState = letterStates[key] ?? "unused";
              const color = KEY_COLORS[key in letterStates ? letterState : "unused"];
              const isWide = key === "ENTER" || key === "⌫";
              return (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={`${isWide ? "px-2 sm:px-4" : "w-8 sm:w-11"} h-14 rounded font-bebas tracking-wider text-base sm:text-lg transition-all duration-150 ${color}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
