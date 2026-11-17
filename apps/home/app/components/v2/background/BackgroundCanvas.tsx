"use client";

import React from "react";
import { useUIPreferences } from "../context/UIPreferencesContext";
import styles from "./BackgroundCanvas.module.css";

export function BackgroundCanvas() {
  const { pattern } = useUIPreferences();

  const getPatternClass = () => {
    switch (pattern) {
      case "diamond":
        return styles.diamondMesh;
      case "diamond-alternate":
        return styles.diamondAlternate;
      case "dual-grid":
        return styles.dualGrid;
      case "dots":
        return styles.dotMatrix;
      case "crosshair":
        return styles.crosshairMatrix;
      case "isometric-cubes":
        return styles.isometricCubes;
      case "ruler-grid":
        return styles.defaultGrid;
      default:
        return styles.diamondMesh;
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
