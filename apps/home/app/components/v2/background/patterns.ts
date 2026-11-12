export type PatternType =
  | "ruler-grid"
  | "dual-grid"
  | "diamond"
  | "fading-circuit"
  | "dots";

export interface PatternConfig {
  id: PatternType;
  name: string;
  description: string;
  badge: string;
}

export const BACKGROUND_PATTERNS: PatternConfig[] = [
  {
    id: "ruler-grid",
    name: "Classic Ruler 24px Grid",
    description: "The signature 24px linear grid from react-native-ruler-date-picker",
    badge: "Classic",
  },
  {
    id: "dual-grid",
    name: "Architectural Dual Grid",
    description: "24px minor grid coupled with 120px major grid and crosshairs",
    badge: "Architectural",
  },
  {
    id: "diamond",
    name: "Isometric Diamond Mesh",
    description: "45-degree intersecting angled mesh",
    badge: "Isometric",
  },
  {
    id: "fading-circuit",
    name: "Fading Circuit Matrix",
    description: "Procedural randomized dashed grid lines fading organically",
    badge: "Procedural",
  },
  {
    id: "dots",
    name: "Matrix Dot Canvas",
    description: "High-density precision dot array with major vertices",
    badge: "Precision",
  },
];
