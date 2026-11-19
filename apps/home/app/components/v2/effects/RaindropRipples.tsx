"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RAINDROP_RIPPLE_CONFIG } from "../config/features";
import styles from "./RaindropRipples.module.css";

interface Droplet {
  id: number;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // diameter in pixels
}

/**
 * RaindropRipples
 *
 * Spawns organic random rain droplets across the viewport that expand outward
 * as concentric ripples, illuminating the active background canvas pattern strokes.
 * Speed, frequency, and size ranges are fully customizable via RAINDROP_RIPPLE_CONFIG.
 */
export function RaindropRipples() {
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const idCounterRef = useRef(0);
  const isMountedRef = useRef(true);

  const removeDroplet = useCallback((id: number) => {
    if (!isMountedRef.current) return;
    setDroplets((prev) => prev.filter((d) => d.id !== id));
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const [minInterval, maxInterval] = RAINDROP_RIPPLE_CONFIG.SPAWN_INTERVAL_MS;
    const [minSize, maxSize] = RAINDROP_RIPPLE_CONFIG.SIZE_RANGE_PX;
    const maxConcurrent = RAINDROP_RIPPLE_CONFIG.MAX_CONCURRENT_DROPS;

    const spawnNextDroplet = () => {
      if (!isMountedRef.current) return;

      // Jittered natural droplet location (keep 5% - 95% within screen edges)
      const x = Math.round(5 + Math.random() * 90);
      const y = Math.round(5 + Math.random() * 90);

      // Random droplet size within the configured range
      const size = Math.round(minSize + Math.random() * (maxSize - minSize));

      const newDroplet: Droplet = {
        id: ++idCounterRef.current,
        x,
        y,
        size,
      };

      setDroplets((prev) => {
        // Enforce maximum concurrent droplets limit to preserve 60fps
        const updated = prev.length >= maxConcurrent ? prev.slice(prev.length - maxConcurrent + 1) : prev;
        return [...updated, newDroplet];
      });

      // Schedule next raindrop with organic jitter
      const nextDelay = Math.round(minInterval + Math.random() * (maxInterval - minInterval));
      timeoutId = setTimeout(spawnNextDroplet, nextDelay);
    };

    // Initial spawn
    timeoutId = setTimeout(spawnNextDroplet, minInterval);

    return () => {
      isMountedRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={styles.raindropContainer} aria-hidden="true">
      {droplets.map((d) => (
        <div
          key={d.id}
          className={styles.raindrop}
          style={
            {
              "--drop-x": `${d.x}%`,
              "--drop-y": `${d.y}%`,
              "--drop-size": `${d.size}px`,
              "--ripple-duration": `${RAINDROP_RIPPLE_CONFIG.RIPPLE_DURATION_SEC}s`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => removeDroplet(d.id)}
        />
      ))}
    </div>
  );
}

