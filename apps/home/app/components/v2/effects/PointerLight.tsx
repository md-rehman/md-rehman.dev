"use client";

import React, { useEffect, useRef } from "react";
import { POINTER_LIGHT_CONFIG } from "../config/features";
import styles from "./PointerLight.module.css";

/**
 * PointerLight
 *
 * Fluid 60fps cursor-tracking ping-pong ripple wave.
 * Instead of fading, the ripple expands outward to POINTER_LIGHT_CONFIG.MAX_RADIUS_PX
 * and then smoothly reverses/contracts back to MIN_RADIUS_PX in a continuous breathing cycle.
 * Illuminates strictly through the active pattern wireframe stencil mask.
 */
export function PointerLight() {
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the device has hover capability
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const trackerEl = trackerRef.current;
    if (!trackerEl) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isVisible = false;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      // Ignore simulated touches
      if (e.pointerType === "touch") return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        trackerEl.style.opacity = "1";
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      trackerEl.style.opacity = "0";
    };

    const onPointerEnter = () => {
      if (targetX > 0 && targetY > 0) {
        isVisible = true;
        trackerEl.style.opacity = "1";
      }
    };

    // Smooth physics-based fluid follow
    const updatePosition = () => {
      if (isVisible) {
        const ease = 0.2;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        trackerEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.documentElement.addEventListener("mouseenter", onPointerEnter);
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.documentElement.removeEventListener("mouseenter", onPointerEnter);
    };
  }, []);

  const maxDiameter = POINTER_LIGHT_CONFIG.MAX_RADIUS_PX * 2;
  const minScale = (POINTER_LIGHT_CONFIG.MIN_RADIUS_PX / POINTER_LIGHT_CONFIG.MAX_RADIUS_PX).toFixed(3);

  const ringStyles: React.CSSProperties = {
    "--pointer-cycle": `${POINTER_LIGHT_CONFIG.CYCLE_DURATION_SEC}s`,
    "--pointer-max-diameter": `${maxDiameter}px`,
    "--pointer-min-scale": minScale,
    "--pointer-thickness": `${POINTER_LIGHT_CONFIG.THICKNESS_PX}px`,
  } as React.CSSProperties;

  return (
    <div ref={trackerRef} className={styles.pointerTracker} aria-hidden="true">
      <div className={styles.rippleRing} style={ringStyles} />
    </div>
  );
}
