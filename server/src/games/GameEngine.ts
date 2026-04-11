import type { Player } from "@1v1/shared";

export interface WinResult {
  winnerId: string | null; // null = draw
}

export interface GameError {
  error: string;
}

export function isGameError(value: unknown): value is GameError {
  return typeof value === "object" && value !== null && "error" in value;
}

export interface GameEngine<TState, TAction> {
  type: string;
  initState(players: [Player, Player]): TState;
  applyAction(state: TState, action: TAction, playerId: string): TState | GameError;
  checkWin(state: TState): WinResult | null;
  serializeForPlayer(state: TState, playerId: string): unknown;
}
