// ── Game types ──────────────────────────────────────────────────────────────

export type GameType = "rps" | "wordle";

export type RoomStatus = "waiting" | "playing" | "finished";

export interface Player {
  id: string;
  name: string;
}

// ── RPS ─────────────────────────────────────────────────────────────────────

export type RPSChoice = "rock" | "paper" | "scissors";

export interface RPSState {
  playerIds: [string, string];               // stable ordered pair, set at game init
  choices: Record<string, RPSChoice | null>; // playerId → choice (null = not yet chosen)
  scores: Record<string, number>;            // playerId → wins
  roundResult: RPSRoundResult | null;
  round: number;
}

export interface RPSRoundResult {
  winner: string | null; // playerId, or null for draw
  choices: Record<string, RPSChoice>;
}

// ── Lobby event payloads (client → server) ───────────────────────────────────

export interface LobbyCreatePayload {
  gameType: GameType;
  playerName: string;
}

export interface LobbyJoinPayload {
  roomCode: string;
  playerName: string;
}

export interface LobbyLeavePayload {
  roomCode: string;
}

// ── Game event payloads (client → server) ────────────────────────────────────

export interface GameActionPayload {
  roomCode: string;
  action: string; // validated per game type on the server
}

export interface GameForfeitPayload {
  roomCode: string;
}

export interface GameRematchPayload {
  roomCode: string;
}

// ── Server → client event payloads ───────────────────────────────────────────

export interface LobbyCreatedPayload {
  roomCode: string;
}

export interface LobbyJoinedPayload {
  roomCode: string;
  players: Player[];
}

export interface LobbyOpponentJoinedPayload {
  opponent: Player;
}

export interface LobbyOpponentLeftPayload {
  opponentId: string;
}

export interface GameStartPayload {
  roomCode: string;
  gameType: GameType;
  players: [Player, Player];
}

export interface GameStateUpdatePayload {
  state: unknown; // typed per-game on the client
}

export interface GameActionRejectedPayload {
  reason: string;
}

export interface GameOverPayload {
  winnerId: string | null;
  forfeit?: boolean;
}

export interface GameRematchRequestedPayload {
  requesterId: string;
}

// ── Wordle ───────────────────────────────────────────────────────────────────

export type LetterResult = "correct" | "present" | "absent";

export interface WordleGuess {
  word: string;       // 5 letters; empty string for opponent view (colors only)
  result: LetterResult[];
}

export interface WordlePlayerState {
  wordIndex: number;
  currentWord: string;    // own: actual word; opponent view: empty string
  guesses: WordleGuess[];
  roundComplete: boolean; // true after solving or exhausting 6 guesses; board resets on next tick
}

export interface WordleState {
  playerIds: [string, string];
  wordSequence: string[]; // server-only; always [] in serialized views sent to clients
  players: Record<string, WordlePlayerState>;
  hp: Record<string, number>;
  lastHpTick: number;     // ms timestamp of last server HP computation
}

// ── Typed Socket.io event maps ───────────────────────────────────────────────

export interface ClientToServerEvents {
  "lobby:create": (payload: LobbyCreatePayload) => void;
  "lobby:join": (payload: LobbyJoinPayload) => void;
  "lobby:leave": (payload: LobbyLeavePayload) => void;
  "lobby:ping": () => void;
  "game:action": (payload: GameActionPayload) => void;
  "game:forfeit": (payload: GameForfeitPayload) => void;
  "game:rematch": (payload: GameRematchPayload) => void;
}

export interface ServerToClientEvents {
  "lobby:created": (payload: LobbyCreatedPayload) => void;
  "lobby:joined": (payload: LobbyJoinedPayload) => void;
  "lobby:opponent_joined": (payload: LobbyOpponentJoinedPayload) => void;
  "lobby:opponent_left": (payload: LobbyOpponentLeftPayload) => void;
  "lobby:pong": () => void;
  "game:start": (payload: GameStartPayload) => void;
  "game:state_update": (payload: GameStateUpdatePayload) => void;
  "game:action_rejected": (payload: GameActionRejectedPayload) => void;
  "game:over": (payload: GameOverPayload) => void;
  "game:rematch_requested": (payload: GameRematchRequestedPayload) => void;
}
