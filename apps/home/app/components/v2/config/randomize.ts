import { PatternType, BACKGROUND_PATTERNS } from "../background/patterns";

/**
 * Curated list of high-contrast, vibrant seed colors designed for the
 * "One Color to Rule Them All" single-seed CSS mathematical engine.
 */
export const RANDOM_SEED_COLORS = [
  "#007AFF", // Apple Signature Blue
  "#10B981", // Emerald Cyber-Green
  "#8B5CF6", // Cosmic Violet
  "#EC4899", // Neon Fuchsia
  "#F59E0B", // Sunset Amber
  "#06B6D4", // Cyan Azure
  "#84CC16", // Cyber Lime
  "#F43F5E", // Vivid Rose
  "#6366F1", // Electric Indigo
  "#14B8A6", // Deep Sea Teal
  "#FB923C", // Tangerine Flame
  "#A855F7", // Arcane Purple
] as const;

export type SeedColor = (typeof RANDOM_SEED_COLORS)[number];

export const DEFAULT_SEED_COLOR: SeedColor = "#007AFF";

/**
 * Extensible registry of ambient effects that can be randomly assigned.
 */
export type EffectType = "POINTER_LIGHT" | "HEARTBEAT_RIPPLE" | "RAINDROP_RIPPLE";

export const RANDOMIZABLE_EFFECTS: EffectType[] = [
  "POINTER_LIGHT",
  "HEARTBEAT_RIPPLE",
  "RAINDROP_RIPPLE",
];

export const RANDOMIZE_STORAGE_KEY = "v2-randomize-experience";

export interface RandomExperience {
  pattern: PatternType;
  seedColor: string;
  effect: EffectType;
}

/**
 * Roll a fresh randomized experience across patterns, seed colors, and visual effects.
 */
export function rollRandomExperience(currentPattern?: PatternType): RandomExperience {
  // 1. Pick a random pattern (prefer a different one than current if possible)
  const patternCandidates = BACKGROUND_PATTERNS.map((p) => p.id);
  const filteredPatterns =
    currentPattern && patternCandidates.length > 1
      ? patternCandidates.filter((p) => p !== currentPattern)
      : patternCandidates;
  const pattern =
    filteredPatterns[Math.floor(Math.random() * filteredPatterns.length)] ||
    patternCandidates[0]!;

  // 2. Pick a random seed color
  const seedColor =
    RANDOM_SEED_COLORS[Math.floor(Math.random() * RANDOM_SEED_COLORS.length)]!;

  // 3. Pick 1 random effect from the registry
  const effect =
    RANDOMIZABLE_EFFECTS[Math.floor(Math.random() * RANDOMIZABLE_EFFECTS.length)]!;

  return { pattern, seedColor, effect };
}

