import type { GameType } from "@1v1/shared";
import { Room } from "./Room.js";

const ROOM_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function generateCode(): string {
  return Array.from({ length: 6 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

export class RoomManager {
  private rooms = new Map<string, Room>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), ROOM_TTL_MS);
  }

  create(gameType: GameType): Room {
    let code: string;
    do {
      code = generateCode();
    } while (this.rooms.has(code));

    const room = new Room(code, gameType);
    this.rooms.set(code, room);
    return room;
  }

  get(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  delete(code: string): void {
    this.rooms.get(code)?.clearGameInterval();
    this.rooms.delete(code);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [code, room] of this.rooms) {
      if (now - room.lastActivityAt > ROOM_TTL_MS) {
        room.clearGameInterval();
        this.rooms.delete(code);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}
