"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import styles from "./GlassModal.module.css";
import { CloseIcon } from "../icons";

export type DockState = "none" | "left" | "right";

export interface GlassModalProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  position?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }, isManual: boolean) => void;
  onDockChange?: (docked: DockState) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onClose?: () => void;
  defaultPosition?: { x: number; y: number } | (() => { x: number; y: number });
  defaultDocked?: DockState;
  noPadding?: boolean;
}

export function GlassModal({
  id,
  title,
  icon,
  badge,
  children,
  width = 340,
  height,
  maxHeight,
  position: controlledPosition,
  onPositionChange,
  onDockChange,
  onCollapseChange,
  onClose,
  defaultPosition,
  defaultDocked = "none",
  noPadding = false,
}: GlassModalProps) {
  const [position, setPosition] = useState(() => {
    let initialPos = { x: 30, y: 100 };
    if (controlledPosition) {
      initialPos = controlledPosition;
    } else if (typeof defaultPosition === "function") {
      initialPos = defaultPosition();
    } else if (defaultPosition) {
      initialPos = defaultPosition;
    }
    if (typeof window !== "undefined" && id) {
      try {
        const stored = localStorage.getItem(`glass-modal-${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!controlledPosition && parsed.isManual && parsed.position) {
            initialPos = parsed.position;
          }
        }
      } catch {}
    }
    return initialPos;
  });

  const [docked, setDocked] = useState<DockState>(() => {
    if (typeof window !== "undefined" && id) {
      try {
        const stored = localStorage.getItem(`glass-modal-${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.docked) return parsed.docked;
        }
      } catch {}
    }
    return defaultDocked;
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined" && id) {
      try {
        const stored = localStorage.getItem(`glass-modal-${id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isCollapsed !== undefined) return parsed.isCollapsed;
        }
      } catch {}
    }
    return false;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [snapPreview, setSnapPreview] = useState<"none" | "left" | "right">("none");

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const snapThreshold = 70;

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [prevControlled, setPrevControlled] = useState(controlledPosition);
  if (
    controlledPosition &&
    !isDragging &&
    (controlledPosition.x !== prevControlled?.x || controlledPosition.y !== prevControlled?.y)
  ) {
    setPrevControlled(controlledPosition);
    setPosition(controlledPosition);
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || docked !== "none") return;
    if ((e.target as HTMLElement).closest("button")) return;

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const newX = dragRef.current.initialX + dx;
    const newY = Math.max(64, dragRef.current.initialY + dy);

    setPosition({ x: newX, y: newY });

    const elWidth = modalRef.current?.offsetWidth || 340;
    if (newX < snapThreshold) {
      setSnapPreview("left");
    } else if (window.innerWidth - (newX + elWidth) < snapThreshold) {
      setSnapPreview("right");
    } else {
      setSnapPreview("none");
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);

    let finalPos = position;
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      finalPos = {
        x: dragRef.current.initialX + dx,
        y: Math.max(64, dragRef.current.initialY + dy),
      };
      setPosition(finalPos);
    }
    dragRef.current = null;

    const newDocked = snapPreview !== "none" ? snapPreview : "none";
    if (snapPreview !== "none") {
      setDocked(snapPreview);
      onDockChange?.(snapPreview);
    }
    setSnapPreview("none");

    if (id) {
      try {
        localStorage.setItem(
          `glass-modal-${id}`,
          JSON.stringify({
            position: finalPos,
            docked: newDocked,
            isCollapsed,
            isManual: true,
          })
        );
      } catch {}
    }
    onPositionChange?.(finalPos, true);
  };

  const undock = () => {
    let newX = position.x;
    if (docked === "left") {
      newX = 24;
    } else if (docked === "right") {
      const modalWidth = typeof width === "number" ? width : 340;
      newX = window.innerWidth - modalWidth - 24;
    }
    const newPos = { ...position, x: newX };
    setPosition(newPos);
    setDocked("none");
    onDockChange?.("none");
    if (id) {
      try {
        localStorage.setItem(
          `glass-modal-${id}`,
          JSON.stringify({
            position: newPos,
            docked: "none",
            isCollapsed,
            isManual: true,
          })
        );
      } catch {}
    }
    onPositionChange?.(newPos, true);
  };

  const handleToggleCollapse = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    onCollapseChange?.(nextCollapsed);
    if (id) {
      try {
        localStorage.setItem(
          `glass-modal-${id}`,
          JSON.stringify({
            position,
            docked,
            isCollapsed: nextCollapsed,
            isManual: true,
          })
        );
      } catch {}
    }
  };

  if (!mounted) return null;

  if (docked !== "none") {
    return (
      <button
        type="button"
        className={`${styles.dockTab} ${styles[docked]}`}
        onClick={undock}
        style={{ top: Math.max(80, position.y) }}
        title="Restore Modal"
      >
        <svg
          className={styles.dockIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {docked === "left" ? (
            <polyline points="9 18 15 12 9 6" />
          ) : (
            <polyline points="15 18 9 12 15 6" />
          )}
        </svg>
        <span className={styles.dockTitle}>{title}</span>
      </button>
    );
  }

  return (
    <>
      {snapPreview !== "none" && (
        <div
          className={`${styles.snapPreview} ${
            snapPreview === "left" ? styles.snapPreviewLeft : styles.snapPreviewRight
          }`}
        />
      )}

      <div
        id={id}
        ref={modalRef}
        className={`${styles.modal} glass ${isDragging ? styles.dragging : ""}`}
        style={{
          left: position.x,
          top: position.y,
          width: width ?? undefined,
          height: isCollapsed
            ? undefined
            : typeof height === "number"
            ? `${height}px`
            : height ?? undefined,
          maxHeight: isCollapsed
            ? undefined
            : typeof maxHeight === "number"
            ? `${maxHeight}px`
            : maxHeight ?? `calc(100vh - ${Math.max(0, position.y)}px - 24px)`,
        }}
      >
        <div
          className={`${styles.header} ${isCollapsed ? styles.headerCollapsed : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className={styles.titleWrapper}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <h3 className={styles.title}>{title}</h3>
            {badge && <span className={styles.badge}>{badge}</span>}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleToggleCollapse}
              className={styles.iconBtn}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <svg
                className={`${styles.chevron} ${isCollapsed ? styles.chevronClosed : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={styles.iconBtn}
                title="Close"
                aria-label="Close"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className={`${styles.content} ${noPadding ? styles.noPadding : ""}`}>
            {children}
          </div>
        )}
      </div>
    </>
  );
}
