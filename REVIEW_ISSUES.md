# Open Review Issues

Issues tracked here are warnings and suggestions from code reviews that have not yet been resolved.
Critical issues are fixed immediately and do not appear here.

Format per entry:
- **ID** — unique identifier (`S` = security, `C` = correctness, `P` = performance, `R` = readability)
- **File & line** — location at time of review
- **Issue** — one-sentence description
- **Recommendation** — one-sentence fix
- **Review date** — when this was first flagged

---

## Security & Privacy

- **S-5** | `server/src/socket/gameHandlers.ts:19` | `rematchRequests` is module-level state that is never deleted when a room is removed, creating an unbounded memory leak. | Move rematch tracking into the `Room` class so it is cleaned up with the room, or call `rematchRequests.delete(roomCode)` inside `handleLeave`. | 2026-04-11

- **S-7** | `server/src/socket/lobbyHandlers.ts:64–79`, `gameHandlers.ts:72–79` | `lobby:leave` and `game:forfeit` still accept a client-supplied `roomCode`; the server should derive the room from `socket.rooms` instead of trusting the client. | On explicit leave/forfeit, look up the room via `socket.rooms` rather than the client-supplied code. | 2026-04-11

- **S-8** | `server/.env` | `server/.env` is only protected by the root `.gitignore`; a change to the root ignore could accidentally expose it. | Add a `server/.gitignore` that explicitly ignores `.env` and `.env.*`. | 2026-04-11

- **S-9** | `server/src/index.ts:14–16` | The `/health` endpoint exposes `NODE_ENV` to any caller. | Remove `env` from the health response payload, or guard it behind an internal network check. | 2026-04-11

---

## Correctness & Anti-Patterns

- **C-2** | `server/src/games/RockPaperScissors.ts:70–85` | `"hidden"` is cast to `RPSChoice` in `serializeForPlayer`; `"hidden"` is not a valid union member, creating a type lie that will break client emoji rendering. | Extend `RPSChoice` (or the choices map value type) to include `"hidden"` and handle it explicitly on the client. | 2026-04-11

- **C-3** | `server/src/games/RockPaperScissors.ts:64–68` | `checkWin` always returns `null` — the game never ends naturally; it can only end via forfeit. | Implement a win condition (e.g. first to N rounds) or add a hard-coded round cap as a safety net. | 2026-04-11

- **C-4** | `client/app/game/[roomCode]/page.tsx:18` | `socket.id` is read during render before the handshake completes, so `myId` starts as `""` and opponent detection is broken on the first render. | Store socket ID in state via a `useEffect` on the `"connect"` event and show a loading state until resolved. | 2026-04-11

- **C-5** | `client/lib/pendingGame.ts:1–14` | `pendingGame` is a module-level variable; React Strict Mode's double-invocation causes `consumePendingGame()` to return `null` on the second call, leaving the game page stuck on "Loading game…". | Use `sessionStorage` instead of a module variable as the cross-navigation store. | 2026-04-11

- **C-6** | `client/app/game/[roomCode]/page.tsx:64–66` | `state` is cast unconditionally to `RPSState` without a runtime type guard. | Narrow with a Zod schema or an `isRPSState` type guard before casting. | 2026-04-11

- **C-7** | `server/src/socket/lobbyHandlers.ts:33` | `lobby:joined` with `players: []` is used to signal join failure — a fragile implicit contract that breaks if a room exists but has no players. | Add a dedicated `lobby:error` event or a `success: boolean` field to `LobbyJoinedPayload`. | 2026-04-11

- **C-8** | `server/src/socket/lobbyHandlers.ts:68–75`, `socket/index.ts:16` | The `"disconnect"` handler is registered in two places; this will cause double-execution issues as the codebase grows. | Handle all disconnect logic in one place — either in `socket/index.ts` or by exposing a `cleanup()` from each handler module. | 2026-04-11

- **C-9** | `client/hooks/useLobby.ts:56–59` | `createRoom` emits `lobby:create` immediately after `connect()` without confirming the handshake completed; events may be silently dropped. | Emit only inside the `"connect"` callback to guarantee the socket is open. | 2026-04-11

- **C-10** | `client/hooks/useGameState.ts:14–21` | `initialRPSState` on the client omits the required `playerIds` field from the shared `RPSState` type, producing a broken first render and a hidden TypeScript error at the cast site. | Remove `initialRPSState` from the client entirely and initialize `state` to `null`; rely exclusively on the server's `game:state_update` as the authoritative source. | 2026-04-11

---

## Performance

- **P-2** | `server/src/rooms/RoomManager.ts:17–19` | The cleanup interval fires every `ROOM_TTL_MS` (10 min = the TTL itself), so stale rooms can persist up to 20 minutes before collection. | Run the cleanup interval at half the TTL (5 min) to bound worst-case stale room lifetime to 1.5× the TTL. | 2026-04-11

- **P-3** | `server/src/rooms/RoomManager.ts:21–29` | `generateCode` retries in an unbounded `do...while` loop with no iteration cap or error path. | Add a max-retry guard (e.g. 10 attempts) and throw a descriptive error if all attempts collide. | 2026-04-11

- **P-4** | `server/src/index.ts` | `RoomManager.destroy()` is never called on process shutdown (`SIGTERM`/`SIGINT`), so the cleanup interval prevents graceful exit. | Register `process.on("SIGTERM", ...)` and `process.on("SIGINT", ...)` handlers that call `roomManager.destroy()` before exiting. | 2026-04-11

---

## Readability

- **R-1** | `server/src/socket/gameHandlers.ts:19` | `rematchRequests` is module-level state invisible to anyone reading `Room.ts` or `RoomManager.ts`. | Move it into the `Room` class as `rematchRequesters: Set<string>` so all room state is co-located. | 2026-04-11

- **R-2** | `server/src/socket/lobbyHandlers.ts:49` | The inline `as [typeof room.players[0], typeof room.players[0]]` cast is verbose and repeated. | Type `Room.players` as a discriminated tuple once full or add a typed `getPlayers(): [Player, Player]` accessor. | 2026-04-11

- **R-3** | `client/app/game/[roomCode]/page.tsx:40–44` | The "Leave" button in the game-over state emits `game:forfeit`, which is semantically wrong for a finished game. | Change it to emit `lobby:leave` (or navigate home) and rename the button to match its behavior. | 2026-04-11

- **R-4** | `shared/src/types.ts:85` | `GameStateUpdatePayload.state: unknown` forces an unsafe cast at every consumer. | Make the interface generic: `GameStateUpdatePayload<T = unknown> { state: T }` so callers can parameterize with `RPSState`. | 2026-04-11

- **R-5** | `server/src/games/RockPaperScissors.ts:65–67` | The `checkWin` stub returns `null` with a comment acknowledging it is unimplemented, which misleads readers into thinking the function is a valid no-op rather than a missing feature. | Add a `// TODO:` tag, or remove the stub entirely until the win-condition feature is implemented. | 2026-04-11
