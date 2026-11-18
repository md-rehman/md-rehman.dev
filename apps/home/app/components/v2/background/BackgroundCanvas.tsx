"use client";

import React from "react";
import { useUIPreferences } from "../context/UIPreferencesContext";
import { PointerLight } from "../effects/PointerLight";
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

  const getPatternStrokeMaskClass = () => {
    switch (pattern) {
      case "diamond":
        return styles.maskDiamondMesh;
      case "diamond-alternate":
        return styles.maskDiamondAlternate;
      case "dual-grid":
        return styles.maskDualGrid;
      case "dots":
        return styles.maskDotMatrix;
      case "crosshair":
        return styles.maskCrosshairMatrix;
      case "isometric-cubes":
        return styles.maskIsometricCubes;
      case "ruler-grid":
        return styles.maskDefaultGrid;
      default:
        return styles.maskDiamondMesh;
    }
  };

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      {/* Background ambient glows matching react-native-ruler-date-picker */}
      <div className={styles.glowTop} />
      <div className={styles.glowAccent} />

      {/* Base Pattern Grid Layer (z-index: 1) */}
      <div className={`${styles.patternLayer} ${getPatternClass()}`} suppressHydrationWarning />

      {/* Interactive Light strictly illuminating pattern wireframe strokes (z-index: 2) */}
      <div className={`${styles.lightMaskContainer} ${getPatternStrokeMaskClass()}`} suppressHydrationWarning>
        <PointerLight />
      </div>
    </div>
  );
}
