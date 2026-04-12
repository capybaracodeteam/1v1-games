import type { Player, LetterResult, WordleGuess, WordlePlayerState, WordleState } from "@1v1/shared";
import type { GameEngine, GameError, WinResult } from "./GameEngine.js";
import { randomSubset, VALID_WORDS } from "./wordleWords.js";

const WORD_SEQUENCE_LENGTH = 15;
const MAX_GUESSES = 6;
const MAX_HP = 200;
const START_HP = 100;

function scoreGuess(guess: string, word: string): LetterResult[] {
  const result: LetterResult[] = Array(5).fill("absent");
  const remaining = word.split("");
  const guessLetters = guess.split("");

  // Pass 1: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === remaining[i]) {
      result[i] = "correct";
      remaining[i] = "";
      guessLetters[i] = "";
    }
  }

  // Pass 2: present in wrong position
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === "") continue;
    const j = remaining.indexOf(guessLetters[i]);
    if (j !== -1) {
      result[i] = "present";
      remaining[j] = "";
    }
  }

  return result;
}

export const WordleEngine: GameEngine<WordleState, string> = {
  type: "wordle",

  initState(players: [Player, Player]): WordleState {
    const wordSequence = randomSubset(WORD_SEQUENCE_LENGTH);
    const now = Date.now();
    return {
      playerIds: [players[0].id, players[1].id],
      wordSequence,
      players: {
        [players[0].id]: { wordIndex: 0, currentWord: wordSequence[0], guesses: [], roundComplete: false },
        [players[1].id]: { wordIndex: 0, currentWord: wordSequence[0], guesses: [], roundComplete: false },
      },
      hp: { [players[0].id]: START_HP, [players[1].id]: START_HP },
      lastHpTick: now,
    };
  },

  applyAction(state: WordleState, action: string, playerId: string): WordleState | GameError {
    if (!(playerId in state.players)) {
      return { error: "Player not in game" };
    }
    if (!/^[A-Za-z]{5}$/.test(action)) {
      return { error: "Guess must be exactly 5 letters" };
    }
    if (!VALID_WORDS.has(action.toUpperCase())) {
      return { error: "Not a valid word" };
    }

    const playerState = state.players[playerId];
    if (playerState.roundComplete) {
      return { error: "Round complete — wait for next word" };
    }
    if (playerState.guesses.length >= MAX_GUESSES) {
      return { error: "No more guesses this round" };
    }

    const guess = action.toUpperCase();
    const currentWord = playerState.currentWord;
    const result = scoreGuess(guess, currentWord);
    const isCorrect = result.every((r) => r === "correct");
    const newGuesses: WordleGuess[] = [...playerState.guesses, { word: guess, result }];
    const roundDone = isCorrect || newGuesses.length >= MAX_GUESSES;

    const newHp = { ...state.hp };

    // Apply HP bonus/penalty if word solved
    if (isCorrect) {
      const n = newGuesses.length;
      const delta = 50 - 5 * n;
      const opponentId = state.playerIds.find((id) => id !== playerId)!;
      newHp[playerId] = Math.min(MAX_HP, newHp[playerId] + delta);
      newHp[opponentId] = Math.max(0, newHp[opponentId] - delta);
    }

    const updatedPlayerState: WordlePlayerState = {
      ...playerState,
      guesses: newGuesses,
      roundComplete: roundDone,
    };

    return {
      ...state,
      players: { ...state.players, [playerId]: updatedPlayerState },
      hp: newHp,
    };
  },

  checkWin(state: WordleState): WinResult | null {
    for (const pid of state.playerIds) {
      if (state.hp[pid] <= 0) {
        const winnerId = state.playerIds.find((id) => id !== pid) ?? null;
        return { winnerId };
      }
    }
    return null;
  },

  serializeForPlayer(state: WordleState, playerId: string): unknown {
    const opponentId = state.playerIds.find((id) => id !== playerId)!;
    const ownState = state.players[playerId];
    const oppState = state.players[opponentId];

    const serializedPlayers: Record<string, WordlePlayerState> = {
      [playerId]: ownState, // full view
      [opponentId]: {
        wordIndex: oppState.wordIndex,
        currentWord: "",              // hide the word
        guesses: oppState.guesses.map((g) => ({ word: "", result: g.result })), // colors only
        roundComplete: oppState.roundComplete,
      },
    };

    // Strip wordSequence — clients never see it
    const view: Omit<WordleState, "wordSequence"> & { wordSequence: [] } = {
      ...state,
      wordSequence: [],
      players: serializedPlayers,
    };

    return view;
  },
};
