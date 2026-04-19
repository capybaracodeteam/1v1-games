"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useTetris,
  PIECE_COLORS,
  ALL_ROTATIONS,
  computeGhostRow,
  type Board,
  type ActivePiece,
  type PieceType,
} from "@/hooks/useTetris";
import type { TetrisSerializedState } from "@1v1/shared";

// ── Responsive cell size ──────────────────────────────────────────────────────

function useOptimalCellSize(): number {
  const [cell, setCell] = useState(17);
  useEffect(() => {
    function compute() {
      const wCell = (window.innerWidth - 110) / 16;
      const hCell = (window.innerHeight - 170) / 20;
      setCell(Math.max(14, Math.min(Math.floor(Math.min(wCell, hCell)), 42)));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return cell;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRenderBoard(board: Board, piece: ActivePiece | null, ghostRow: number): string[][] {
  const out: string[][] = board.map((row) => row.map((cell) => cell ?? "#1a1a1a"));
  if (!piece) return out;

  const matrix = ALL_ROTATIONS[piece.type][piece.rotation];
  const color = PIECE_COLORS[piece.type];
  const ghost = color + "44";

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const br = ghostRow + r;
      const bc = piece.col + c;
      if (br >= 0 && br < 20 && bc >= 0 && bc < 10 && out[br][bc] === "#1a1a1a") {
        out[br][bc] = ghost;
      }
    }
  }

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const br = piece.row + r;
      const bc = piece.col + c;
      if (br >= 0 && br < 20 && bc >= 0 && bc < 10) out[br][bc] = color;
    }
  }

  return out;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PiecePreview({ type, cellSize }: { type: PieceType | null; cellSize: number }) {
  const boxW = cellSize * 4;
  const boxH = cellSize * 3;
  if (!type) {
    return <div style={{ width: boxW, height: boxH }} />;
  }
  const matrix = ALL_ROTATIONS[type][0];
  const color = PIECE_COLORS[type];
  const cols = matrix[0].length;
  return (
    <div style={{ width: boxW, height: boxH, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gap: 1 }}>
        {matrix.flatMap((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{ width: cellSize, height: cellSize, background: cell ? color : "transparent", borderRadius: 2 }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MiniBoard({ board, cellSize }: { board: Board; cellSize: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(10, ${cellSize}px)`,
        gap: 1,
        background: "#111",
        padding: 2,
        borderRadius: 3,
      }}
    >
      {board.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{ width: cellSize, height: cellSize, background: cell ?? "#1a1a1a", borderRadius: 1 }}
          />
        ))
      )}
    </div>
  );
}

// ── Inner game component (hooks require guaranteed pieceSequence) ──────────────

interface TetrisGameProps {
  pieceSequence: PieceType[];
  serverState: TetrisSerializedState | null;
  onAction: (action: string) => void;
}

function TetrisGame({ pieceSequence, serverState, onAction }: TetrisGameProps) {
  const cell = useOptimalCellSize();
  const previewCell = Math.max(8, Math.round(cell * 0.65));
  const oppCell = Math.max(4, Math.round(cell * 0.28));

  const [pendingGarbage, setPendingGarbage] = useState(0);
  const [opponentBoard, setOpponentBoard] = useState<Board>(() =>
    Array.from({ length: 20 }, () => Array(10).fill(null))
  );
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!serverState) return;
    setPendingGarbage(serverState.myGarbagePending);
    setOpponentBoard(serverState.opponentBoard);
  }, [serverState]);

  const onLinesCleared = useCallback(
    (_count: number, attack: number) => {
      if (attack > 0) onAction(JSON.stringify({ type: "attack", lines: attack }));
    },
    [onAction]
  );

  const onBoardUpdate = useCallback(
    (board: Board) => {
      onAction(JSON.stringify({ type: "board_update", board }));
    },
    [onAction]
  );

  const onGameOver = useCallback(() => {
    setIsGameOver(true);
    onAction(JSON.stringify({ type: "topped_out" }));
  }, [onAction]);

  const { board, currentPiece, ghostRow, nextPieces, holdPiece, lines, level } = useTetris({
    pieceSequence,
    pendingGarbage,
    disabled: isGameOver,
    onLinesCleared,
    onBoardUpdate,
    onGameOver,
  });

  const renderBoard = buildRenderBoard(board, currentPiece, ghostRow);
  const label = "text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1";
  const panelBg = (opacity = 1): React.CSSProperties => ({
    background: "#111",
    borderRadius: 4,
    padding: 4,
    opacity,
  });

  return (
    <div className="flex items-start justify-center gap-2 w-full select-none">
      {/* Left: Hold + stats */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <div>
          <div className={label}>Hold</div>
          <div style={panelBg(holdPiece ? 1 : 0.35)}>
            <PiecePreview type={holdPiece} cellSize={previewCell} />
          </div>
        </div>
        <div className="text-center">
          <div className={label}>Lines</div>
          <div className="text-white font-mono text-sm">{lines}</div>
        </div>
        <div className="text-center">
          <div className={label}>Lvl</div>
          <div className="text-white font-mono text-sm">{level}</div>
        </div>
      </div>

      {/* Center: Main board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(10, ${cell}px)`,
          gap: 1,
          background: "#0a0a0a",
          padding: 2,
          borderRadius: 6,
          border: "1px solid #333",
        }}
      >
        {renderBoard.flatMap((row, r) =>
          row.map((bg, c) => (
            <div
              key={`${r}-${c}`}
              style={{ width: cell, height: cell, background: bg, borderRadius: 2 }}
            />
          ))
        )}
      </div>

      {/* Right: Next + Opponent */}
      <div className="flex flex-col items-center gap-3 pt-1">
        <div>
          <div className={label}>Next</div>
          <div className="flex flex-col gap-1">
            {nextPieces.map((type, i) => (
              <div key={i} style={panelBg()}>
                <PiecePreview type={type} cellSize={previewCell} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={label}>Opp</div>
          <MiniBoard board={opponentBoard} cellSize={oppCell} />
        </div>
      </div>
    </div>
  );
}

// ── Outer component — waits for pieceSequence before mounting game ────────────

interface TetrisProps {
  serverState: TetrisSerializedState | null;
  myId: string;
  onAction: (action: string) => void;
}

export default function Tetris({ serverState, myId: _myId, onAction }: TetrisProps) {
  const [pieceSequence, setPieceSequence] = useState<PieceType[] | null>(null);

  useEffect(() => {
    if (serverState?.pieceSequence && !pieceSequence) {
      setPieceSequence(serverState.pieceSequence);
    }
  }, [serverState, pieceSequence]);

  if (!pieceSequence) {
    return <p className="text-gray-400 animate-pulse">Loading…</p>;
  }

  return (
    <TetrisGame
      pieceSequence={pieceSequence}
      serverState={serverState}
      onAction={onAction}
    />
  );
}
