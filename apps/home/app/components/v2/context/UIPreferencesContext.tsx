"use client";

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";
import { PatternType, PatternConfig, BACKGROUND_PATTERNS } from "../background/patterns";

interface UIPreferencesContextType {
  pattern: PatternType;
  setPattern: (pattern: PatternType) => void;
  cyclePattern: () => void;
  currentPatternConfig: PatternConfig;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const UIPreferencesContext = createContext<UIPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = "home-bg-pattern";
const DEFAULT_PATTERN: PatternType = "diamond-alternate";
const patternListeners = new Set<() => void>();

function subscribePattern(callback: () => void) {
  patternListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    patternListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function getPatternSnapshot(): PatternType {
  if (typeof window === "undefined") return DEFAULT_PATTERN;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as PatternType | null;
    if (saved && BACKGROUND_PATTERNS.some((p) => p.id === saved)) {
      return saved;
    }
  } catch {}
  return DEFAULT_PATTERN;
}

function getServerPatternSnapshot(): PatternType {
  return DEFAULT_PATTERN;
}

function emitPatternChange(next: PatternType) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  patternListeners.forEach((listener) => listener());
}

export function UIPreferencesProvider({ children }: { children: React.ReactNode }) {
  const pattern = useSyncExternalStore(subscribePattern, getPatternSnapshot, getServerPatternSnapshot);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setPattern = useCallback((nextPattern: PatternType) => {
    emitPatternChange(nextPattern);
  }, []);

  const cyclePattern = useCallback(() => {
    const currentIndex = BACKGROUND_PATTERNS.findIndex((p) => p.id === pattern);
    const nextIndex = (currentIndex + 1) % BACKGROUND_PATTERNS.length;
    const target = BACKGROUND_PATTERNS[nextIndex];
    const next: PatternType = target ? target.id : DEFAULT_PATTERN;
    emitPatternChange(next);
  }, [pattern]);

  const fallbackPattern: PatternConfig = BACKGROUND_PATTERNS[0]!;

  const currentPatternConfig: PatternConfig =
    BACKGROUND_PATTERNS.find((p) => p.id === pattern) ?? fallbackPattern;

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  return (
    <UIPreferencesContext.Provider
      value={{
        pattern,
        setPattern,
        cyclePattern,
        currentPatternConfig,
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
      }}
    >
      {children}
    </UIPreferencesContext.Provider>
  );
}

export function useUIPreferences() {
  const context = useContext(UIPreferencesContext);
  if (!context) {
    throw new Error("useUIPreferences must be used within a UIPreferencesProvider");
  }
  return context;
}
