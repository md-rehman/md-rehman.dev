"use client";

import { useState, useRef, type DragEvent } from "react";
import type { CardData } from "./Board";
import styles from "./Card.module.css";

interface CardProps {
  card: CardData;
  columnId: string;
  onUpdate: (columnId: string, cardId: string, updates: Partial<CardData>) => void;
  onDelete: (columnId: string, cardId: string) => void;
  onDragStart: (cardId: string, fromColumnId: string) => void;
  onDragEnd: () => void;
  onAddChild: (title: string) => void;
  colors: string[];
  depth: number;
  childCards: CardData[];
  isDropTarget: boolean;
}

export function Card({
  card,
  columnId,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  onAddChild,
  colors,
  depth,
  childCards,
  isDropTarget,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(card.title);
  const [descValue, setDescValue] = useState(card.description);
  const [showColors, setShowColors] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childTitle, setChildTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // ── Drag ──

  function handleDragStart(e: DragEvent) {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    // Add a small delay for visual feedback
    setTimeout(() => onDragStart(card.id, columnId), 0);
  }

  function handleDragEnd() {
    setIsDragging(false);
    onDragEnd();
  }

  // ── Title editing ──

  function startEditingTitle() {
    setTitleValue(card.title);
    setIsEditingTitle(true);
    setTimeout(() => titleRef.current?.select(), 10);
  }

  function commitTitle() {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== card.title) {
      onUpdate(columnId, card.id, { title: trimmed });
    }
    setIsEditingTitle(false);
  }

  // ── Description ──

  function commitDescription() {
    if (descValue !== card.description) {
      onUpdate(columnId, card.id, { description: descValue });
    }
  }

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ""} ${isExpanded ? styles.expanded : ""} ${isDropTarget ? styles.dropTarget : ""}`}
      style={{ marginLeft: `${depth * 1.5}rem` }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Color label stripe */}
      {card.color && (
        <div
          className={styles.colorStripe}
          style={{ background: card.color }}
        />
      )}

      <div className={styles.body}>
        {/* Title */}
        <div className={styles.titleRow}>
          {isEditingTitle ? (
            <input
              ref={titleRef}
              className={styles.titleInput}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className={styles.title}
              onClick={(e) => {
                e.stopPropagation();
                startEditingTitle();
              }}
            >
              {card.title}
            </p>
          )}
          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, card.id);
              }}
              title="Delete card"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Short Description (when not expanded) */}
        {!isExpanded && card.description && (
          <p className={styles.shortDesc}>
            {card.description}
          </p>
        )}

        {/* Expanded details */}
        {isExpanded && (
          <div className={styles.details}>
            <textarea
              ref={descRef}
              className={styles.descInput}
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={commitDescription}
              placeholder="Add a description…"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Color picker */}
            <div className={styles.colorSection}>
              <button
                className={styles.colorToggle}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColors(!showColors);
                }}
              >
                Label color
                {card.color && (
                  <span
                    className={styles.colorPreview}
                    style={{ background: card.color }}
                  />
                )}
              </button>
              {showColors && (
                <div className={styles.colorPicker}>
                  {colors.map((c) => (
                    <button
                      key={c || "none"}
                      className={`${styles.colorDot} ${card.color === c ? styles.colorActive : ""}`}
                      style={{
                        background: c || "var(--surface-active)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(columnId, card.id, { color: c });
                        setShowColors(false);
                      }}
                      title={c || "No color"}
                    >
                      {!c && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Children Section */}
            <div className={styles.childrenSection}>
              <div className={styles.childrenHeader}>Subtasks ({childCards.length})</div>
              {childCards.length > 0 && (
                <div className={styles.childrenList}>
                  {childCards.map(child => (
                    <div key={child.id} className={styles.childItem}>
                      <span className={styles.childDot} />
                      {child.title}
                    </div>
                  ))}
                </div>
              )}
              {showAddChild ? (
                <div className={styles.addChildForm}>
                  <input
                    autoFocus
                    className={styles.childInput}
                    value={childTitle}
                    onChange={(e) => setChildTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && childTitle.trim()) {
                        onAddChild(childTitle.trim());
                        setChildTitle("");
                        setShowAddChild(false);
                      }
                      if (e.key === "Escape") {
                        setChildTitle("");
                        setShowAddChild(false);
                      }
                    }}
                    placeholder="Subtask title..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={styles.addChildActions}>
                    <button
                      className={styles.addChildBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (childTitle.trim()) {
                          onAddChild(childTitle.trim());
                          setChildTitle("");
                          setShowAddChild(false);
                        }
                      }}
                    >
                      Add
                    </button>
                    <button
                      className={styles.cancelChildBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setChildTitle("");
                        setShowAddChild(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.showAddChildBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddChild(true);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add subtask
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
