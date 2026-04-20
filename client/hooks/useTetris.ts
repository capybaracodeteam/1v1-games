"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

const BOARD_ROWS = 20;
const BOARD_COLS = 10;
const NEXT_COUNT = 3;
const GRAVITY_BASE_MS = 800;
const DAS_MS = 167;
const ARR_MS = 33;
const LOCK_DELAY_MS = 500;
const MAX_LOCK_RESETS = 15;
const ATTACK_TABLE = [0, 0, 1, 2, 4]; // index = lines cleared

// ── Types ────────────────────────────────────────────────────────────────────

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type Cell = string | null;
export type Board = Cell[][];

export interface ActivePiece {
  type: PieceType;
  rotation: number;
  row: number;
  col: number;
}

export interface TetrisDisplay {
  board: Board;
  currentPiece: ActivePiece | null;
  ghostRow: number;
  nextPieces: PieceType[];
  holdPiece: PieceType | null;
  isGameOver: boolean;
  lines: number;
}

// ── Piece data ───────────────────────────────────────────────────────────────

export const PIECE_COLORS: Record<PieceType, string> = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0050ff",
  L: "#f0a000",
};

export const ALL_ROTATIONS: Record<PieceType, number[][][]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]]],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]],[[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],[[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]],[[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]],[[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]],[[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]],[[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]],[[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],[[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]],[[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],[[1,1,0],[0,1,0],[0,1,0]],
  ],
};

// SRS wall kicks: [dcol, drow] — positive drow = down
const JLSTZ_KICKS: Record<string, [number, number][]> = {
  "0→1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  "1→0": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  "1→2": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  "2→1": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  "2→3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  "3→2": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  "3→0": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  "0→3": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
};

const I_KICKS: Record<string, [number, number][]> = {
  "0→1": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  "1→0": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  "1→2": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  "2→1": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  "2→3": [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  "3→2": [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  "3→0": [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  "0→3": [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
};

// ── Pure helpers ─────────────────────────────────────────────────────────────

export function emptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null));
}


export function isValid(board: Board, type: PieceType, rotation: number, row: number, col: number): boolean {
  const matrix = ALL_ROTATIONS[type][rotation];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const br = row + r;
      const bc = col + c;
      if (bc < 0 || bc >= BOARD_COLS || br >= BOARD_ROWS) return false;
      if (br >= 0 && board[br][bc] !== null) return false;
    }
  }
  return true;
}

export function computeGhostRow(board: Board, piece: ActivePiece): number {
  let row = piece.row;
  while (isValid(board, piece.type, piece.rotation, row + 1, piece.col)) row++;
  return row;
}

function applyLock(board: Board, piece: ActivePiece): Board {
  const next = board.map((r) => [...r]);
  const matrix = ALL_ROTATIONS[piece.type][piece.rotation];
  const color = PIECE_COLORS[piece.type];
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const br = piece.row + r;
      const bc = piece.col + c;
      if (br >= 0 && br < BOARD_ROWS) next[br][bc] = color;
    }
  }
  return next;
}

function clearLines(board: Board): { board: Board; count: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const count = BOARD_ROWS - remaining.length;
  const empties = Array.from({ length: count }, () => Array<Cell>(BOARD_COLS).fill(null));
  return { board: [...empties, ...remaining], count };
}

export function addGarbage(board: Board, lines: number): Board {
  if (lines <= 0) return board;
  const holeCol = Math.floor(Math.random() * BOARD_COLS);
  const garbageRow = (): Cell[] =>
    Array.from({ length: BOARD_COLS }, (_, c) => (c === holeCol ? null : "#666"));
  const garbage = Array.from({ length: lines }, garbageRow);
  return [...board.slice(lines), ...garbage];
}

function tryRotate(board: Board, piece: ActivePiece, dir: 1 | -1): ActivePiece | null {
  const from = piece.rotation;
  const to = (from + dir + 4) % 4;
  const key = `${from}→${to}`;
  const kicks = piece.type === "I" ? I_KICKS[key] : JLSTZ_KICKS[key];
  if (!kicks) return null;
  for (const [dc, dr] of kicks) {
    if (isValid(board, piece.type, to, piece.row + dr, piece.col + dc)) {
      return { ...piece, rotation: to, row: piece.row + dr, col: piece.col + dc };
    }
  }
  return null;
}

function spawnPiece(type: PieceType): ActivePiece {
  const cols = ALL_ROTATIONS[type][0][0].length;
  return { type, rotation: 0, row: -1, col: Math.floor((BOARD_COLS - cols) / 2) };
}

function gravityMs(elapsedSeconds: number): number {
  // Decreases by 3ms per second, floored at 100ms (~4.5 min to reach max speed)
  return Math.max(100, GRAVITY_BASE_MS - elapsedSeconds * 3);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseTetrisOptions {
  pieceSequence: PieceType[];
  pendingGarbage: number;
  disabled: boolean;
  onLinesCleared: (count: number, attack: number) => void;
  onBoardUpdate: (board: Board) => void;
  onGameOver: () => void;
}

export function useTetris({
  pieceSequence,
  pendingGarbage,
  disabled,
  onLinesCleared,
  onBoardUpdate,
  onGameOver,
}: UseTetrisOptions): TetrisDisplay {
  // Game state — all in refs to avoid stale closures in RAF/timers
  const boardRef = useRef<Board>(emptyBoard());
  const currentRef = useRef<ActivePiece | null>(null);
  const pieceIndexRef = useRef(0);
  const holdRef = useRef<PieceType | null>(null);
  const canHoldRef = useRef(true);
  const linesRef = useRef(0);
  const isGameOverRef = useRef(false);
  const appliedGarbageRef = useRef(0);
  const pendingGarbageRef = useRef(pendingGarbage);

  // Timing refs
  const rafRef = useRef<number | null>(null);
  const lastFallRef = useRef(0);
  const gameStartTimeRef = useRef(Date.now());
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockResetCountRef = useRef(0);

  // DAS/ARR refs
  const dasTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dasKeyRef = useRef<string | null>(null);

  // Stable callback refs
  const cbLines = useRef(onLinesCleared);
  const cbBoard = useRef(onBoardUpdate);
  const cbOver = useRef(onGameOver);
  useEffect(() => { cbLines.current = onLinesCleared; }, [onLinesCleared]);
  useEffect(() => { cbBoard.current = onBoardUpdate; }, [onBoardUpdate]);
  useEffect(() => { cbOver.current = onGameOver; }, [onGameOver]);

  // Keep pendingGarbageRef in sync with prop
  useEffect(() => { pendingGarbageRef.current = pendingGarbage; }, [pendingGarbage]);

  const [display, setDisplay] = useState<TetrisDisplay>({
    board: emptyBoard(),
    currentPiece: null,
    ghostRow: 0,
    nextPieces: [],
    holdPiece: null,
    isGameOver: false,
    lines: 0,
  });

  const sync = useCallback(() => {
    const piece = currentRef.current;
    setDisplay({
      board: boardRef.current,
      currentPiece: piece,
      ghostRow: piece ? computeGhostRow(boardRef.current, piece) : 0,
      nextPieces: Array.from({ length: NEXT_COUNT }, (_, i) =>
        pieceSequence[(pieceIndexRef.current + i) % pieceSequence.length]
      ),
      holdPiece: holdRef.current,
      isGameOver: isGameOverRef.current,
      lines: linesRef.current,
    });
  }, [pieceSequence]);

  // Apply incoming garbage immediately when pendingGarbage increases
  useEffect(() => {
    const delta = pendingGarbage - appliedGarbageRef.current;
    if (delta <= 0 || isGameOverRef.current) return;

    boardRef.current = addGarbage(boardRef.current, delta);
    appliedGarbageRef.current = pendingGarbage;

    // Push active piece up if garbage collides with it
    const piece = currentRef.current;
    if (piece) {
      let row = piece.row;
      while (row > -10 && !isValid(boardRef.current, piece.type, piece.rotation, row, piece.col)) {
        row--;
      }
      currentRef.current = { ...piece, row };
    }

    sync();
  }, [pendingGarbage, sync]);

  function cancelLock() {
    if (lockTimerRef.current !== null) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }

  function spawnNext(): boolean {
    const type = pieceSequence[pieceIndexRef.current % pieceSequence.length];
    pieceIndexRef.current++;
    const piece = spawnPiece(type);
    if (!isValid(boardRef.current, piece.type, piece.rotation, piece.row, piece.col)) {
      isGameOverRef.current = true;
      currentRef.current = null;
      sync();
      cbOver.current();
      return false;
    }
    currentRef.current = piece;
    lockResetCountRef.current = 0;
    return true;
  }

  function lockCurrent() {
    const piece = currentRef.current;
    if (!piece || isGameOverRef.current) return;
    cancelLock();

    // Lock piece at current position, then clear lines
    boardRef.current = applyLock(boardRef.current, piece);
    const { board, count } = clearLines(boardRef.current);
    boardRef.current = board;
    currentRef.current = null;

    if (count > 0) {
      linesRef.current += count;
      cbLines.current(count, ATTACK_TABLE[count] ?? 0);
    }

    cbBoard.current(boardRef.current);
    canHoldRef.current = true;
    lastFallRef.current = performance.now();
    spawnNext();
    sync();
  }

  function scheduleLock() {
    if (lockTimerRef.current !== null) return;
    lockTimerRef.current = setTimeout(lockCurrent, LOCK_DELAY_MS);
  }

  function tryMove(dr: number, dc: number): boolean {
    const piece = currentRef.current;
    if (!piece || isGameOverRef.current) return false;
    if (!isValid(boardRef.current, piece.type, piece.rotation, piece.row + dr, piece.col + dc)) return false;
    currentRef.current = { ...piece, row: piece.row + dr, col: piece.col + dc };
    if (dc !== 0 && !isValid(boardRef.current, piece.type, piece.rotation, piece.row + dr + 1, piece.col + dc)) {
      if (lockResetCountRef.current < MAX_LOCK_RESETS) {
        lockResetCountRef.current++;
        cancelLock();
        scheduleLock();
      }
    }
    sync();
    return true;
  }

  function doRotate(dir: 1 | -1) {
    const piece = currentRef.current;
    if (!piece || isGameOverRef.current) return;
    const rotated = tryRotate(boardRef.current, piece, dir);
    if (!rotated) return;
    currentRef.current = rotated;
    if (!isValid(boardRef.current, rotated.type, rotated.rotation, rotated.row + 1, rotated.col)) {
      if (lockResetCountRef.current < MAX_LOCK_RESETS) {
        lockResetCountRef.current++;
        cancelLock();
        scheduleLock();
      }
    }
    sync();
  }

  function doHardDrop() {
    const piece = currentRef.current;
    if (!piece || isGameOverRef.current) return;
    currentRef.current = { ...piece, row: computeGhostRow(boardRef.current, piece) };
    lockCurrent();
  }

  function doHold() {
    const piece = currentRef.current;
    if (!piece || !canHoldRef.current || isGameOverRef.current) return;
    canHoldRef.current = false;
    const prev = holdRef.current;
    holdRef.current = piece.type;
    currentRef.current = null;
    if (prev) {
      const next = spawnPiece(prev);
      if (!isValid(boardRef.current, next.type, next.rotation, next.row, next.col)) {
        isGameOverRef.current = true;
        sync();
        cbOver.current();
        return;
      }
      currentRef.current = next;
      lockResetCountRef.current = 0;
    } else {
      spawnNext();
    }
    sync();
  }

  // RAF gravity loop — runs once on mount
  useEffect(() => {
    gameStartTimeRef.current = Date.now();
    lastFallRef.current = performance.now();
    spawnNext();
    sync();

    function tick(now: number) {
      if (isGameOverRef.current) return;
      const piece = currentRef.current;
      if (!piece) { rafRef.current = requestAnimationFrame(tick); return; }

      const elapsedSeconds = (Date.now() - gameStartTimeRef.current) / 1000;
      if (now - lastFallRef.current >= gravityMs(elapsedSeconds)) {
        lastFallRef.current = now;
        if (isValid(boardRef.current, piece.type, piece.rotation, piece.row + 1, piece.col)) {
          currentRef.current = { ...piece, row: piece.row + 1 };
          sync();
        } else {
          scheduleLock();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        lastFallRef.current = performance.now();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      cancelLock();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard input
  useEffect(() => {
    if (disabled) return;

    function clearDAS() {
      if (dasTimerRef.current !== null) { clearTimeout(dasTimerRef.current); dasTimerRef.current = null; }
      if (arrIntervalRef.current !== null) { clearInterval(arrIntervalRef.current); arrIntervalRef.current = null; }
      dasKeyRef.current = null;
    }

    function startDAS(key: string, action: () => void) {
      if (dasKeyRef.current === key) return;
      clearDAS();
      dasKeyRef.current = key;
      action();
      dasTimerRef.current = setTimeout(() => {
        arrIntervalRef.current = setInterval(action, ARR_MS);
      }, DAS_MS);
    }

    const PREVENT_KEYS = new Set([
      "ArrowLeft","ArrowRight","ArrowDown","ArrowUp",
      "KeyA","KeyD","KeyS","KeyW","Space","KeyC","ShiftLeft","ShiftRight",
    ]);

    function onKeyDown(e: KeyboardEvent) {
      if (isGameOverRef.current) return;
      if (PREVENT_KEYS.has(e.code)) e.preventDefault();
      switch (e.code) {
        case "ArrowLeft": case "KeyA":
          startDAS("left", () => tryMove(0, -1)); break;
        case "ArrowRight": case "KeyD":
          startDAS("right", () => tryMove(0, 1)); break;
        case "ArrowDown": case "KeyS":
          startDAS("down", () => { lastFallRef.current = performance.now(); tryMove(1, 0); }); break;
        case "ArrowUp": case "KeyW":
          if (!e.repeat) doRotate(1); break;
        case "Space":
          if (!e.repeat) doHardDrop(); break;
        case "KeyC": case "ShiftLeft": case "ShiftRight":
          if (!e.repeat) doHold(); break;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if ((e.code === "ArrowLeft" || e.code === "KeyA") && dasKeyRef.current === "left") clearDAS();
      if ((e.code === "ArrowRight" || e.code === "KeyD") && dasKeyRef.current === "right") clearDAS();
      if ((e.code === "ArrowDown" || e.code === "KeyS") && dasKeyRef.current === "down") clearDAS();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      clearDAS();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return display;
}
