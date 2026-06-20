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
  parentId?: string;
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

function enforceBoardConstraints(board: BoardData): BoardData {
  const allCards = board.columns.flatMap((c) => c.cards);
  const cardMap = new Map(allCards.map((c) => [c.id, c]));

  function getGlobalRootId(cardId: string): string {
    const visited = new Set<string>();
    let curr = cardId;
    while (true) {
      if (visited.has(curr)) break;
      visited.add(curr);
      const parentId = cardMap.get(curr)?.parentId;
      if (!parentId || !cardMap.has(parentId)) break;
      curr = parentId;
    }
    return curr;
  }

  const newColumns = board.columns.map((col) => {
    const clumps = new Map<string, CardData[]>();
    const clumpOrder: string[] = [];

    for (const card of col.cards) {
      const rootId = getGlobalRootId(card.id);
      if (!clumps.has(rootId)) {
        clumps.set(rootId, []);
        clumpOrder.push(rootId);
      }
      clumps.get(rootId)!.push(card);
    }

    const sortedCards: CardData[] = [];

    for (const rootId of clumpOrder) {
      const clumpCards = clumps.get(rootId)!;
      const clumpSet = new Set(clumpCards.map((c) => c.id));
      const localChildren = new Map<string, CardData[]>();
      const localRoots: CardData[] = [];

      for (const card of clumpCards) {
        let curr = card.parentId;
        let foundLocalParent = false;
        const visited = new Set<string>();
        while (curr) {
          if (visited.has(curr)) break;
          visited.add(curr);
          if (clumpSet.has(curr)) {
            if (!localChildren.has(curr)) localChildren.set(curr, []);
            localChildren.get(curr)!.push(card);
            foundLocalParent = true;
            break;
          }
          curr = cardMap.get(curr)?.parentId;
        }
        if (!foundLocalParent) {
          localRoots.push(card);
        }
      }

      function traverse(card: CardData) {
        sortedCards.push(card);
        const children = localChildren.get(card.id) || [];
        for (const child of children) {
          traverse(child);
        }
      }

      for (const root of localRoots) {
        traverse(root);
      }
    }

    return { ...col, cards: sortedCards };
  });

  return { ...board, columns: newColumns };
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
        setBoard(enforceBoardConstraints(JSON.parse(saved)));
      } else {
        setBoard(enforceBoardConstraints(DEFAULT_BOARD));
      }
    } catch {
      setBoard(enforceBoardConstraints(DEFAULT_BOARD));
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
      return enforceBoardConstraints({
        ...prev,
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
      });
    });
  }, []);

  const addChildCard = useCallback((columnId: string, parentId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return enforceBoardConstraints({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === columnId) {
            const newCards = [...col.cards];
            const targetIdx = newCards.findIndex((c) => c.id === parentId);
            if (targetIdx === -1) return col;

            let lastDescendantIdx = targetIdx;
            const descendants = new Set<string>([parentId]);
            for (let i = targetIdx + 1; i < newCards.length; i++) {
              const currentCard = newCards[i];
              if (currentCard?.parentId && descendants.has(currentCard.parentId)) {
                descendants.add(currentCard.id);
                lastDescendantIdx = i;
              } else {
                break;
              }
            }
            newCards.splice(lastDescendantIdx + 1, 0, { id: genId(), title, description: "", color: "", parentId });
            return { ...col, cards: newCards };
          }
          return col;
        }),
      });
    });
  }, []);

  const updateCard = useCallback(
    (columnId: string, cardId: string, updates: Partial<CardData>) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return enforceBoardConstraints({
          ...prev,
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
        });
      });
    },
    [],
  );

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return enforceBoardConstraints({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            : col,
        ),
      });
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
    (toColumnId: string, insertIndex?: number, targetCardId?: string) => {
      if (!dragState || !board) return;

      const { cardId, fromColumnId } = dragState;
      if (fromColumnId === toColumnId && insertIndex === undefined && !targetCardId) {
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
        return enforceBoardConstraints({
          ...prev,
          columns: newColumns.map((col) => {
            if (col.id === toColumnId) {
              const newCards = [...col.cards];
              const cardToInsert = { ...card };
              
              let finalInsertIndex = insertIndex !== undefined ? insertIndex : newCards.length;
              
              if (targetCardId) {
                cardToInsert.parentId = targetCardId;
                const targetIdx = newCards.findIndex(c => c.id === targetCardId);
                if (targetIdx !== -1) {
                  let lastDescendantIdx = targetIdx;
                  const descendants = new Set<string>([targetCardId]);
                  for (let i = targetIdx + 1; i < newCards.length; i++) {
                    const currentCard = newCards[i];
                    if (currentCard?.parentId && descendants.has(currentCard.parentId)) {
                      descendants.add(currentCard.id);
                      lastDescendantIdx = i;
                    } else {
                      break;
                    }
                  }
                  finalInsertIndex = lastDescendantIdx + 1;
                }
              }

              newCards.splice(finalInsertIndex, 0, cardToInsert);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        });
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

  // Compute depths and children for all cards
  const allCards = board.columns.flatMap((c) => c.cards);
  const cardDepths = new Map<string, number>();
  const cardChildren = new Map<string, CardData[]>();
  
  for (const card of allCards) {
    if (card.parentId) {
      if (!cardChildren.has(card.parentId)) {
        cardChildren.set(card.parentId, []);
      }
      cardChildren.get(card.parentId)!.push(card);
    }
    
    let depth = 0;
    let curr = card;
    const visited = new Set<string>();
    while (curr.parentId) {
      if (visited.has(curr.id)) break;
      visited.add(curr.id);
      depth++;
      const parent = allCards.find(c => c.id === curr.parentId);
      if (!parent) break;
      curr = parent;
    }
    cardDepths.set(card.id, depth);
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
            onAddChildCard={addChildCard}
            cardColors={CARD_COLORS}
            cardDepths={cardDepths}
            cardChildren={cardChildren}
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
