import type { Player, TetrisPieceType } from "@1v1/shared";
import type { GameEngine, WinResult, GameError } from "./GameEngine.js";

export type BoardCell = string | null;
export type TetrisBoard = BoardCell[][];

export interface TetrisState {
  playerIds: [string, string];
  garbageQueues: Record<string, number>;
  boards: Record<string, TetrisBoard>;
  toppedOut: string | null;
  pieceSequence: TetrisPieceType[];
}

export type TetrisAction =
  | { type: "attack"; lines: number }
  | { type: "board_update"; board: TetrisBoard }
  | { type: "topped_out" };

export interface TetrisSerializedState {
  myGarbagePending: number;
  opponentBoard: TetrisBoard;
  playerIds: [string, string];
  pieceSequence: TetrisPieceType[];
}

function emptyBoard(): TetrisBoard {
  return Array.from({ length: 20 }, () => Array(10).fill(null));
}

function generateSequence(): TetrisPieceType[] {
  const pieces: TetrisPieceType[] = [];
  while (pieces.length < 100) {
    const bag: TetrisPieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    pieces.push(...bag);
  }
  return pieces.slice(0, 100);
}

export const TetrisEngine: GameEngine<TetrisState, TetrisAction> = {
  type: "tetris",

  initState(players: [Player, Player]): TetrisState {
    return {
      playerIds: [players[0].id, players[1].id],
      garbageQueues: { [players[0].id]: 0, [players[1].id]: 0 },
      boards: { [players[0].id]: emptyBoard(), [players[1].id]: emptyBoard() },
      toppedOut: null,
      pieceSequence: generateSequence(),
    };
  },

  applyAction(state: TetrisState, action: TetrisAction, playerId: string): TetrisState | GameError {
    if (!(state.playerIds as string[]).includes(playerId)) {
      return { error: "Player not in game" };
    }

    const opponentId = state.playerIds.find((id) => id !== playerId);
    if (!opponentId) return { error: "Opponent not found" };

    if (action.type === "attack") {
      if (typeof action.lines !== "number" || action.lines < 0 || action.lines > 4) {
        return { error: "Invalid attack" };
      }
      return {
        ...state,
        garbageQueues: {
          ...state.garbageQueues,
          [opponentId]: state.garbageQueues[opponentId] + action.lines,
        },
      };
    }

    if (action.type === "board_update") {
      if (
        !Array.isArray(action.board) ||
        action.board.length !== 20 ||
        action.board.some(
          (row) =>
            !Array.isArray(row) ||
            row.length !== 10 ||
            row.some((cell) => cell !== null && typeof cell !== "string")
        )
      ) {
        return { error: "Invalid board" };
      }
      return {
        ...state,
        boards: { ...state.boards, [playerId]: action.board },
      };
    }

    if (action.type === "topped_out") {
      return { ...state, toppedOut: playerId };
    }

    return { error: "Unknown action type" };
  },

  checkWin(state: TetrisState): WinResult | null {
    if (state.toppedOut !== null) {
      const winnerId = state.playerIds.find((id) => id !== state.toppedOut) ?? null;
      return { winnerId };
    }
    return null;
  },

  serializeForPlayer(state: TetrisState, playerId: string): TetrisSerializedState {
    const opponentId = state.playerIds.find((id) => id !== playerId)!;
    return {
      myGarbagePending: state.garbageQueues[playerId] ?? 0,
      opponentBoard: state.boards[opponentId] ?? emptyBoard(),
      playerIds: state.playerIds,
      pieceSequence: state.pieceSequence,
    };
  },
};
