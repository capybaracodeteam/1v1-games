import type { Player, RPSChoice, RPSState } from "@1v1/shared";
import type { GameEngine, GameError, WinResult } from "./GameEngine.js";

const BEATS: Record<RPSChoice, RPSChoice> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

export const RockPaperScissorsEngine: GameEngine<RPSState, RPSChoice> = {
  type: "rps",

  initState(players: [Player, Player]): RPSState {
    return {
      playerIds: [players[0].id, players[1].id],
      choices: { [players[0].id]: null, [players[1].id]: null },
      hearts: { [players[0].id]: 3, [players[1].id]: 3 },
      roundResult: null,
      round: 1,
    };
  },

  applyAction(state: RPSState, action: RPSChoice, playerId: string): RPSState | GameError {
    if (!(playerId in state.choices)) {
      return { error: "Player not in game" };
    }
    if (state.choices[playerId] !== null) {
      return { error: "Already submitted a choice this round" };
    }
    if (!["rock", "paper", "scissors"].includes(action)) {
      return { error: "Invalid choice" };
    }

    const updated: RPSState = {
      ...state,
      choices: { ...state.choices, [playerId]: action },
      roundResult: null,
    };

    const [p1, p2] = state.playerIds;
    const c1 = updated.choices[p1];
    const c2 = updated.choices[p2];

    if (c1 !== null && c2 !== null) {
      let winnerId: string | null = null;
      if (c1 !== c2) {
        winnerId = BEATS[c1] === c2 ? p1 : p2;
      }

      const newHearts = { ...updated.hearts };
      if (winnerId) {
        const loserId = state.playerIds.find((id) => id !== winnerId)!;
        newHearts[loserId] = Math.max(0, newHearts[loserId] - 1);
      }

      return {
        ...updated,
        hearts: newHearts,
        roundResult: { winner: winnerId, choices: { [p1]: c1, [p2]: c2 } },
        round: updated.round + 1,
        choices: { [p1]: null, [p2]: null },
      };
    }

    return updated;
  },

  checkWin(state: RPSState): WinResult | null {
    for (const pid of state.playerIds) {
      if ((state.hearts[pid] ?? 3) <= 0) {
        const winnerId = state.playerIds.find((id) => id !== pid) ?? null;
        return { winnerId };
      }
    }
    return null;
  },

  serializeForPlayer(state: RPSState, playerId: string): unknown {
    // Hide the opponent's choice until both have submitted (roundResult is null).
    if (state.roundResult !== null) {
      return state; // reveal all after round resolves
    }
    const hidden: RPSState = {
      ...state,
      choices: Object.fromEntries(
        Object.entries(state.choices).map(([id, choice]) => [
          id,
          id === playerId ? choice : choice !== null ? ("hidden" as RPSChoice) : null,
        ])
      ),
    };
    return hidden;
  },
};
