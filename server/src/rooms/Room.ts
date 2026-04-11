import type { GameType, Player, RoomStatus } from "@1v1/shared";

export class Room {
  readonly code: string;
  readonly gameType: GameType;
  players: Player[] = [];
  status: RoomStatus = "waiting";
  gameState: unknown = null;
  lastActivityAt: number = Date.now();
  gameInterval: ReturnType<typeof setInterval> | null = null;

  constructor(code: string, gameType: GameType) {
    this.code = code;
    this.gameType = gameType;
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  hasPlayer(id: string): boolean {
    return this.players.some((p) => p.id === id);
  }

  removePlayer(id: string): void {
    this.players = this.players.filter((p) => p.id !== id);
  }

  touch(): void {
    this.lastActivityAt = Date.now();
  }

  clearGameInterval(): void {
    if (this.gameInterval !== null) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }
}
