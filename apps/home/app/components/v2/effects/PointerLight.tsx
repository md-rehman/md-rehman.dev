"use client";

import React, { useEffect, useRef } from "react";
import styles from "./PointerLight.module.css";

export function PointerLight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the device has hover capability
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const lightEl = lightRef.current;
    if (!lightEl) return;

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
        lightEl.style.opacity = "1";
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      lightEl.style.opacity = "0";
    };

    const onPointerEnter = () => {
      if (targetX > 0 && targetY > 0) {
        isVisible = true;
        lightEl.style.opacity = "1";
      }
    };

    // Smooth physics-based fluid follow
    const updatePosition = () => {
      if (isVisible) {
        const ease = 0.18;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        lightEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
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

  return <div ref={lightRef} className={styles.pointerLight} aria-hidden="true" />;
}

