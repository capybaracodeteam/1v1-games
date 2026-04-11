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
  absent:  "bg-gray-600 text-white border-gray-600",
};

const KEY_COLORS: Record<LetterResult | "unused", string> = {
  correct: "bg-green-600 text-white",
  present: "bg-yellow-500 text-white",
  absent:  "bg-gray-500 text-white",
  unused:  "bg-gray-200 text-black",
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
  // Red bar covers 0-100, blue overheal covers 101-200
  // Both expressed as % of the full 200-unit bar width
  const redPct = Math.min(clampedHp, 100) / 2;       // 0% – 50%
  const bluePct = Math.max(0, clampedHp - 100) / 2;  // 0% – 50%

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold">{label}</span>
        <span>{Math.round(clampedHp)} HP</span>
      </div>
      <div className="relative w-full h-4 bg-gray-700 rounded overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-red-500"
          style={{ width: `${redPct}%` }}
        />
        {clampedHp > 100 && (
          <div
            className="absolute top-0 h-full bg-blue-500"
            style={{ left: "50%", width: `${bluePct}%` }}
          />
        )}
        {/* midpoint marker */}
        <div className="absolute top-0 h-full w-px bg-gray-400" style={{ left: "50%" }} />
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
    <div className="flex gap-1">
      {cells.map((_, i) => {
        if (guess) {
          const letter = guess.word[i] ?? "";
          const result = guess.result[i];
          const color = letter ? (result ? TILE_COLORS[result] : "bg-gray-200 border-gray-400") : "bg-gray-200 border-gray-400";
          return (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center border-2 font-bold text-sm uppercase ${color}`}
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
              className={`w-10 h-10 flex items-center justify-center border-2 font-bold text-sm uppercase ${letter ? "border-gray-600 bg-white" : "border-gray-300 bg-white"}`}
            >
              {letter}
            </div>
          );
        }
        return (
          <div key={i} className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 bg-white" />
        );
      })}
    </div>
  );
}

function MiniTileRow({ guess }: { guess?: WordleGuess }) {
  return (
    <div className="flex gap-0.5">
      {Array(5).fill(null).map((_, i) => {
        const result = guess?.result[i];
        const color = result ? TILE_COLORS[result] : "bg-gray-300";
        return <div key={i} className={`w-4 h-4 ${color}`} />;
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

  const elapsedSec = Math.floor((now - state.lastHpTick) / 1000);
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
      <div className="text-sm text-gray-500">
        Word {(myState?.wordIndex ?? 0) + 1} / {state.wordSequence.length || 15}
      </div>

      {/* Main layout: my board + opponent mini-board */}
      <div className="flex gap-8 items-start">
        {/* My board */}
        <div className="flex flex-col gap-1">
          {myState?.roundComplete ? (
            <p className="text-sm text-gray-500 mb-2 text-center">Next word coming…</p>
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
        <div className="flex flex-col gap-0.5 mt-6">
          <p className="text-xs text-gray-500 mb-1 text-center">
            Opponent (word {(oppState?.wordIndex ?? 0) + 1})
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
                  className={`${isWide ? "px-3" : "w-8"} h-10 rounded font-semibold text-xs ${color}`}
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
