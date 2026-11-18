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

  /**
   * Enables rhythmic heartbeat ripple effect expanding from screen center along pattern wireframes.
   * Set to `false` to disable.
   */
  ENABLE_HEARTBEAT_RIPPLE: true,
} as const;

/**
 * Easily customizable configuration for Heartbeat Stroke Ripple
 */
export const HEARTBEAT_RIPPLE_CONFIG = {
  /**
   * Cycle duration in seconds for one full heartbeat (lub-dub + rest).
   * - 2.5s: energetic / rapid pulse
   * - 3.8s: natural resting heartbeat (Default)
   * - 5.0s: slow, calm ambient pulse
   */
  CYCLE_DURATION_SEC: 8,

  /**
   * Delay in seconds between the primary (lub) and secondary (dub) pulse wave.
   */
  SECONDARY_PULSE_DELAY_SEC: 0.35,
} as const;

