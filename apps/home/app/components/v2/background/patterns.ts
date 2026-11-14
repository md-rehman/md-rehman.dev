export type PatternType =
  | "ruler-grid"
  | "dual-grid"
  | "diamond"
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
    description: "Dashed 120px major structural grid with subtle dotted 24px blueprint subdivisions",
    badge: "Architectural",
  },
  {
    id: "diamond",
    name: "Isometric Diamond Mesh",
    description: "45-degree intersecting angled mesh",
    badge: "Isometric",
  },
  {
    id: "dots",
    name: "Matrix Dot Canvas",
    description: "High-density precision dot array with major vertices",
    badge: "Precision",
  },
];
