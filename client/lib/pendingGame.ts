import type { GameStartPayload } from "@1v1/shared";

// Holds the game:start payload between the lobby navigation and the game page mount.
let pending: GameStartPayload | null = null;

export function setPendingGame(payload: GameStartPayload): void {
  pending = payload;
}

export function consumePendingGame(): GameStartPayload | null {
  const p = pending;
  pending = null;
  return p;
}
