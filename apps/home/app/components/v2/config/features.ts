/**
 * Global Feature Flags for Home V2 Experience
 * Easily toggleable directly in code.
 */
export const FEATURE_FLAGS = {
  /**
   * Enables interactive category filtering tabs (All, Libraries, Full-Stack, Mobile)
   * in the Projects section. Set to `false` to disable filters.
   */
  ENABLE_PROJECT_FILTERS: true,

  /**
   * Enables Bento / Hero layout highlighting flagship projects (e.g. react-native-ruler-date-picker)
   * with prominent 2-column featured styling and metrics.
   */
  ENABLE_BENTO_PROJECT_LAYOUT: true,

  /**
   * Enables 60fps ambient pointer light effect with pattern wireframe masking.
   * Set to `false` to disable the pointer light entirely.
   */
  ENABLE_POINTER_LIGHT: false,
} as const;

