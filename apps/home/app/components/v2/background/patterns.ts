export type PatternType =
  | "diamond"
  | "diamond-alternate"
  | "dual-grid"
  | "dots"
  | "crosshair"
  | "isometric-cubes"
  | "ruler-grid";

export interface PatternConfig {
  id: PatternType;
  name: string;
  description: string;
  badge: string;
}

export const BACKGROUND_PATTERNS: PatternConfig[] = [
  {
    id: "diamond",
    name: "Isometric Diamond Mesh",
    description: "45-degree intersecting angled mesh creating diamond facets",
    badge: "Isometric",
  },
  {
    id: "diamond-alternate",
    name: "Alternating Diamond Mesh",
    description: "Isometric 45-degree diamond mesh with 20% translucent gray alternating facets",
    badge: "Faceted",
  },
  {
    id: "dual-grid",
    name: "Architectural Dual Grid",
    description: "Dashed 120px major structural grid with subtle dotted 24px blueprint subdivisions",
    badge: "Architectural",
  },
  {
    id: "dots",
    name: "Matrix Dot Canvas",
    description: "High-density precision dot array with major vertices",
    badge: "Precision",
  },
  {
    id: "crosshair",
    name: "Cyber Crosshair Matrix",
    description: "Precision HUD coordinate crosshairs at 48px intervals with central vertex pins",
    badge: "Crosshair",
  },
  {
    id: "isometric-cubes",
    name: "3D Wireframe Cube Voxels",
    description: "Axonometric tumbling 3D wireframe cube voxel grid",
    badge: "Voxel",
  },
  {
    id: "ruler-grid",
    name: "Classic Ruler 24px Grid",
    description: "The signature 24px linear grid from react-native-ruler-date-picker",
    badge: "Classic",
  },
];
