"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import styles from "./GlassTooltip.module.css";

interface GlassTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "bottom" | "top";
}

interface Coords {
  top: number;
  left: number;
  placement: "bottom" | "top";
  originX: number;
  originY: number;
  width?: number;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function GlassTooltip({
  content,
  children,
  placement: preferredPlacement,
}: GlassTooltipProps) {
  const mounted = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = useCallback(
    (triggerRect: DOMRect, tooltipRect?: DOMRect): Coords => {
      const tooltipW = tooltipRect ? tooltipRect.width : 200;
      const tooltipH = tooltipRect ? tooltipRect.height : 42;

      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      let place: "bottom" | "top" = preferredPlacement || "bottom";
      if (!preferredPlacement) {
        if (spaceBelow < tooltipH + 16 && spaceAbove > tooltipH + 16) {
          place = "top";
        } else {
          place = "bottom";
        }
      }

      const idealLeft = triggerRect.left + triggerRect.width / 2 - tooltipW / 2;
      const maxLeft = Math.max(12, window.innerWidth - tooltipW - 14);
      const left = Math.max(12, Math.min(idealLeft, maxLeft));

      const top =
        place === "bottom"
          ? triggerRect.bottom + 6
          : triggerRect.top - tooltipH - 6;

      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const originX = Math.round(triggerCenterX - left);
      const originY = place === "bottom" ? 0 : Math.round(tooltipH);

      return {
        top: Math.round(top),
        left: Math.round(left),
        placement: place,
        originX,
        originY,
        width: tooltipW,
      };
    },
    [preferredPlacement]
  );

  const showTooltip = useCallback(() => {
    if (!content) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const initialCoords = calculatePosition(rect);
      setCoords(initialCoords);
    }

    setIsMounted(true);
  }, [content, calculatePosition]);

  const hideTooltip = useCallback(() => {
    setIsActive(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsMounted(false);
    }, 160);
  }, []);

  useLayoutEffect(() => {
    if (!isMounted || !triggerRef.current) return;

    const update = () => {
      if (!triggerRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();

      if (
        triggerRect.bottom < 0 ||
        triggerRect.top > window.innerHeight ||
        triggerRect.right < 0 ||
        triggerRect.left > window.innerWidth
      ) {
        setIsActive(false);
        return;
      }

      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const nextCoords = calculatePosition(triggerRect, tooltipRect);
      setCoords(nextCoords);
    };

    update();

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setIsActive(true);
      });
      return () => cancelAnimationFrame(raf2);
    });

    const handleScrollResize = () => update();

    window.addEventListener("scroll", handleScrollResize, true);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("scroll", handleScrollResize, true);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [isMounted, calculatePosition]);

  if (!content) {
    return children;
  }

  const arrowLeft = coords
    ? Math.max(10, Math.min((coords.width || 200) - 18, coords.originX - 4))
    : 10;

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.triggerWrapper}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </span>

      {mounted &&
        isMounted &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={`${styles.portalTooltip} ${isActive ? styles.active : ""}`}
            style={{
              top: coords ? `${coords.top}px` : "-9999px",
              left: coords ? `${coords.left}px` : "-9999px",
              transformOrigin: coords
                ? `${coords.originX}px ${coords.originY}px`
                : "top center",
            }}
          >
            {coords && (
              <span
                className={`${styles.arrow} ${
                  coords.placement === "bottom" ? styles.arrowBottom : styles.arrowTop
                }`}
                style={{ left: `${arrowLeft}px` }}
              />
            )}
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

