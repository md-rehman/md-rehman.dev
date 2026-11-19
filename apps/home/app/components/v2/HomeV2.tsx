"use client";

import React from "react";
import { UIPreferencesProvider } from "./context/UIPreferencesContext";
import { BackgroundCanvas } from "./background/BackgroundCanvas";
import { GlassNavbar } from "./layout/GlassNavbar";
import { GlassHero } from "./layout/GlassHero";
import { GlassAppShowcase } from "./layout/GlassAppShowcase";
import { GlassTimeline } from "./layout/GlassTimeline";
import { GlassFooter } from "./layout/GlassFooter";
import { InspectorModal } from "./glass/InspectorModal";
import styles from "./HomeV2.module.css";
import "./styles/one-color-to-rule-them-all.css";
import "./styles/glass-tokens.css";

export function HomeV2() {
  return (
    <UIPreferencesProvider>
      <div className={styles.page} suppressHydrationWarning>
        {/* Dynamic Background Patterns & Ambient Glows from react-native-ruler-date-picker */}
        <BackgroundCanvas />

        {/* Floating Glass TopBar Navigation */}
        <GlassNavbar />

        {/* Main Content with Exact Original Text & Glass Cards */}
        <main className={styles.mainContent}>
          <GlassHero />
          <GlassAppShowcase />
          <GlassTimeline />
        </main>

        {/* Translucent Glass Footer */}
        <GlassFooter />

        {/* Draggable Dockable Glass Modal */}
        <InspectorModal />
      </div>
    </UIPreferencesProvider>
  );
}
