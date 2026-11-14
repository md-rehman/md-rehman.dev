"use client";

import React from "react";
import { useUIPreferences } from "../context/UIPreferencesContext";
import styles from "./BackgroundCanvas.module.css";

export function BackgroundCanvas() {
  const { pattern } = useUIPreferences();

  const getPatternClass = () => {
    switch (pattern) {
      case "ruler-grid":
        return styles.defaultGrid;
      case "dual-grid":
        return styles.dualGrid;
      case "diamond":
        return styles.diamondMesh;
      case "dots":
        return styles.dotMatrix;
      default:
        return styles.defaultGrid;
    }
  };

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      {/* Background ambient glows matching react-native-ruler-date-picker */}
      <div className={styles.glowTop} />
      <div className={styles.glowAccent} />

      {/* Pattern Grid Layer */}
      <div className={getPatternClass()} suppressHydrationWarning />
    </div>
  );
}
