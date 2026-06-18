"use client";

import { useState, useEffect, useCallback } from "react";
import { Column } from "./Column";
import styles from "./Board.module.css";

// ── Types ──────────────────────────────────────────────────────────

export interface CardData {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}

export interface BoardData {
  columns: ColumnData[];
}

// ── Constants ──────────────────────────────────────────────────────

const STORAGE_KEY = "planner-board-data";

const CARD_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#22c55e", // green
  "#06b6d4", // cyan
  "#f97316", // orange
  "",         // none
];

const DEFAULT_BOARD: BoardData = {
  columns: [
    { id: genId(), title: "To Do", cards: [] },
    { id: genId(), title: "In Progress", cards: [] },
    { id: genId(), title: "Review", cards: [] },
    { id: genId(), title: "Done", cards: [] },
  ],
};

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ── Board Component ────────────────────────────────────────────────

export function Board() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [dragState, setDragState] = useState<{
    cardId: string;
    fromColumnId: string;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBoard(JSON.parse(saved));
      } else {
        setBoard(DEFAULT_BOARD);
      }
    } catch {
      setBoard(DEFAULT_BOARD);
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (board) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
  }, [board]);

  // ── Column operations ──

  const addColumn = useCallback(() => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        columns: [
          ...prev.columns,
          { id: genId(), title: "New Column", cards: [] },
        ],
      };
    });
  }, []);

  const updateColumnTitle = useCallback((columnId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, title } : col,
        ),
      };
    });
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        columns: prev.columns.filter((col) => col.id !== columnId),
      };
    });
  }, []);

  // ── Card operations ──

  const addCard = useCallback((columnId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  { id: genId(), title, description: "", color: "" },
                ],
              }
            : col,
        ),
      };
    });
  }, []);

  const updateCard = useCallback(
    (columnId: string, cardId: string, updates: Partial<CardData>) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  cards: col.cards.map((card) =>
                    card.id === cardId ? { ...card, ...updates } : card,
                  ),
                }
              : col,
          ),
        };
      });
    },
    [],
  );

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col,
        ),
      };
    });
  }, []);

  // ── Drag & Drop ──

  const handleDragStart = useCallback(
    (cardId: string, fromColumnId: string) => {
      setDragState({ cardId, fromColumnId });
    },
    [],
  );

  const handleDrop = useCallback(
    (toColumnId: string, insertIndex?: number) => {
      if (!dragState || !board) return;

      const { cardId, fromColumnId } = dragState;
      if (fromColumnId === toColumnId && insertIndex === undefined) {
        setDragState(null);
        return;
      }

      // Find the card
      const sourceCol = board.columns.find((c) => c.id === fromColumnId);
      const card = sourceCol?.cards.find((c) => c.id === cardId);
      if (!card) {
        setDragState(null);
        return;
      }

      setBoard((prev) => {
        if (!prev) return prev;
        const newColumns = prev.columns.map((col) => {
          // Remove from source
          if (col.id === fromColumnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          return col;
        });

        // Add to target
        return {
          columns: newColumns.map((col) => {
            if (col.id === toColumnId) {
              const newCards = [...col.cards];
              const idx =
                insertIndex !== undefined
                  ? insertIndex
                  : newCards.length;
              newCards.splice(idx, 0, card);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        };
      });

      setDragState(null);
    },
    [dragState, board],
  );

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  // ── Render ──

  if (!board) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
      </div>
    );
  }

  return (
    <div className={styles.board}>
      <div className={styles.columnsTrack}>
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            isDragging={dragState !== null}
            onUpdateTitle={updateColumnTitle}
            onDelete={deleteColumn}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            cardColors={CARD_COLORS}
          />
        ))}

        <button onClick={addColumn} className={styles.addColumnBtn}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add column</span>
        </button>
      </div>
    </div>
  );
}
