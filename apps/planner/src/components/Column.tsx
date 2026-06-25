"use client";

import { useState, useRef, type DragEvent } from "react";
import type { ColumnData, CardData } from "./Board";
import { Card } from "./Card";
import { AddCardForm } from "./AddCardForm";
import styles from "./Column.module.css";

interface ColumnProps {
  column: ColumnData;
  isDragging: boolean;
  onUpdateTitle: (columnId: string, title: string) => void;
  onDelete: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (columnId: string, cardId: string, updates: Partial<CardData>) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDragStart: (cardId: string, fromColumnId: string) => void;
  onDrop: (toColumnId: string, insertIndex?: number, targetCardId?: string) => void;
  onDragEnd: () => void;
  onAddChildCard: (columnId: string, parentId: string, title: string) => void;
  cardColors: string[];
  cardDepths: Map<string, number>;
  cardChildren: Map<string, CardData[]>;
}

export function Column({
  column,
  isDragging,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onDragStart,
  onDrop,
  onDragEnd,
  onAddChildCard,
  cardColors,
  cardDepths,
  cardChildren,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(column.title);
  const [isOver, setIsOver] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // ── Title editing ──

  function startEditing() {
    setEditValue(column.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 10);
  }

  function commitTitle() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateTitle(column.id, trimmed);
    }
    setIsEditing(false);
  }

  // ── Drag over ──

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);

    // Calculate drop index based on cursor position
    if (cardsRef.current) {
      const cards = Array.from(cardsRef.current.children) as HTMLElement[];
      const rect = cardsRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top + cardsRef.current.scrollTop;

      let idx = cards.length;
      let targetId: string | null = null;
      for (let i = 0; i < cards.length; i++) {
        const cardEl = cards[i];
        if (!cardEl) continue;
        const cardRect = cardEl.getBoundingClientRect();
        const top = cardRect.top - rect.top + cardsRef.current.scrollTop;
        const bottom = top + cardRect.height;

        if (y >= top && y <= bottom) {
          if (y < top + cardRect.height * 0.25) {
            idx = i;
          } else if (y > bottom - cardRect.height * 0.25) {
            idx = i + 1;
          } else {
            idx = i;
            targetId = cardEl.getAttribute("data-card-id");
          }
          break;
        }

        if (y > bottom) {
          idx = i + 1;
        }
      }
      setDropIndex(idx);
      setDropTargetId(targetId);
    }
  }

  function handleDragLeave(e: DragEvent) {
    // Only trigger if leaving the column itself
    const related = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(related)) return;
    setIsOver(false);
    setDropIndex(null);
    setDropTargetId(null);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsOver(false);
    onDrop(column.id, dropIndex ?? undefined, dropTargetId ?? undefined);
    setDropIndex(null);
    setDropTargetId(null);
  }

  return (
    <div
      className={`${styles.column} ${isOver ? styles.over : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {isEditing ? (
            <input
              ref={inputRef}
              className={styles.titleInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
            />
          ) : (
            <h3 className={styles.title} onClick={startEditing}>
              {column.title}
            </h3>
          )}
          <span className={styles.count}>{column.cards.length}</span>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.menuBtn}
            onClick={() => setShowMenu(!showMenu)}
            title="Column options"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {showMenu && (
            <div className={styles.menu}>
              <button
                className={styles.menuItem}
                onClick={() => {
                  setShowMenu(false);
                  startEditing();
                }}
              >
                Rename
              </button>
              <button
                className={`${styles.menuItem} ${styles.menuDanger}`}
                onClick={() => {
                  setShowMenu(false);
                  if (column.cards.length === 0 || confirm(`Delete "${column.title}" and its ${column.cards.length} card(s)?`)) {
                    onDelete(column.id);
                  }
                }}
              >
                Delete column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Cards ── */}
      <div className={styles.cards} ref={cardsRef}>
        {column.cards.map((card, index) => (
          <div key={card.id} data-card-id={card.id}>
            {dropIndex === index && !dropTargetId && isOver && (
              <div className={styles.dropIndicator} />
            )}
            <Card
              card={card}
              columnId={column.id}
              depth={cardDepths.get(card.id) ?? 0}
              childCards={cardChildren.get(card.id) ?? []}
              isDropTarget={dropTargetId === card.id}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onAddChild={(title) => onAddChildCard(column.id, card.id, title)}
              colors={cardColors}
            />
          </div>
        ))}
        {dropIndex === column.cards.length && !dropTargetId && isOver && (
          <div className={styles.dropIndicator} />
        )}
      </div>

      {/* ── Add Card ── */}
      <div className={styles.footer}>
        {showAddForm ? (
          <AddCardForm
            onSubmit={(title) => {
              onAddCard(column.id, title);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button
            className={styles.addCardBtn}
            onClick={() => setShowAddForm(true)}
          >
            <svg
              width="14"
              height="14"
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
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}
