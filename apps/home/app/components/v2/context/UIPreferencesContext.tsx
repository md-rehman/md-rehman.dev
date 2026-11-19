"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  useEffect,
} from "react";
import { PatternType, PatternConfig, BACKGROUND_PATTERNS } from "../background/patterns";
import {
  EffectType,
  rollRandomExperience,
  DEFAULT_SEED_COLOR,
  RANDOMIZE_STORAGE_KEY,
} from "../config/randomize";

interface UIPreferencesContextType {
  pattern: PatternType;
  setPattern: (pattern: PatternType) => void;
  cyclePattern: () => void;
  currentPatternConfig: PatternConfig;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;

  // Randomize Experience
  isRandomizeEnabled: boolean;
  toggleRandomize: () => void;
  activeRandomEffect: EffectType | null;
  activeSeedColor: string;
}

const UIPreferencesContext = createContext<UIPreferencesContextType | undefined>(undefined);

const DEFAULT_PATTERN: PatternType = "diamond-alternate";
const randomizeListeners = new Set<() => void>();

function subscribeRandomize(callback: () => void) {
  randomizeListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    randomizeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function getRandomizeSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(RANDOMIZE_STORAGE_KEY) === "true";
  } catch {}
  return false;
}

function getServerRandomizeSnapshot(): boolean {
  return false;
}

function emitRandomizeChange(next: boolean) {
  try {
    localStorage.setItem(RANDOMIZE_STORAGE_KEY, String(next));
  } catch {}
  randomizeListeners.forEach((listener) => listener());
}

export function UIPreferencesProvider({ children }: { children: React.ReactNode }) {
  const isRandomizeEnabled = useSyncExternalStore(
    subscribeRandomize,
    getRandomizeSnapshot,
    getServerRandomizeSnapshot
  );

  const [manualPattern, setManualPattern] = useState<PatternType>(DEFAULT_PATTERN);
  const [randomExperience, setRandomExperience] = useState<{
    pattern: PatternType;
    seedColor: string;
    effect: EffectType;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Roll fresh random values on page load / refresh when Randomize is enabled
  useEffect(() => {
    // Clean up any legacy home-bg-pattern or obsolete keys from localStorage
    try {
      localStorage.removeItem("home-bg-pattern");
      localStorage.removeItem("home-v2-bg-pattern");
    } catch {}

    if (isRandomizeEnabled) {
      // Async tick avoids synchronous state-in-effect lint warning while rolling on mount
      const timer = setTimeout(() => {
        const roll = rollRandomExperience();
        setRandomExperience(roll);
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--color-seed", roll.seedColor);
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setRandomExperience(null);
        if (typeof document !== "undefined") {
          document.documentElement.style.removeProperty("--color-seed");
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isRandomizeEnabled]);

  // Handle toggling randomize state (ON / OFF)
  const toggleRandomize = useCallback(() => {
    const nextState = !isRandomizeEnabled;
    emitRandomizeChange(nextState);

    if (nextState) {
      // Immediately roll a fresh random experience in memory
      const roll = rollRandomExperience();
      setRandomExperience(roll);
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--color-seed", roll.seedColor);
      }
    } else {
      // Reset back to default settings
      setRandomExperience(null);
      if (typeof document !== "undefined") {
        document.documentElement.style.removeProperty("--color-seed");
      }
    }
  }, [isRandomizeEnabled]);

  const activePattern: PatternType =
    isRandomizeEnabled && randomExperience ? randomExperience.pattern : manualPattern;

  const activeRandomEffect: EffectType | null =
    isRandomizeEnabled && randomExperience ? randomExperience.effect : null;

  const activeSeedColor: string =
    isRandomizeEnabled && randomExperience ? randomExperience.seedColor : DEFAULT_SEED_COLOR;

  const setPattern = useCallback((nextPattern: PatternType) => {
    setManualPattern(nextPattern);
  }, []);

  const cyclePattern = useCallback(() => {
    setManualPattern((prev) => {
      const currentIndex = BACKGROUND_PATTERNS.findIndex((p) => p.id === prev);
      const nextIndex = (currentIndex + 1) % BACKGROUND_PATTERNS.length;
      const target = BACKGROUND_PATTERNS[nextIndex];
      return target ? target.id : DEFAULT_PATTERN;
    });
  }, []);

  const fallbackPattern: PatternConfig = BACKGROUND_PATTERNS[0]!;
  const currentPatternConfig: PatternConfig =
    BACKGROUND_PATTERNS.find((p) => p.id === activePattern) ?? fallbackPattern;

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  return (
    <UIPreferencesContext.Provider
      value={{
        pattern: activePattern,
        setPattern,
        cyclePattern,
        currentPatternConfig,
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
        isRandomizeEnabled,
        toggleRandomize,
        activeRandomEffect,
        activeSeedColor,
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

