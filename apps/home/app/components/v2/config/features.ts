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
   * Enables 60fps ambient pointer light ripple effect with pattern wireframe masking.
   * Set to `false` to disable the pointer light entirely.
   */
  ENABLE_POINTER_LIGHT: false,

  /**
   * Enables rhythmic heartbeat ripple effect expanding from screen center along pattern wireframes.
   * Set to `false` to disable.
   */
  ENABLE_HEARTBEAT_RIPPLE: false,

  /**
   * Enables random raindrop ripples falling across the screen and illuminating pattern wireframes.
   * Set to `false` to disable.
   */
  ENABLE_RAINDROP_RIPPLE: true,

  /**
   * Enables the Glass & Canvas Inspector floating button launcher in the Navbar.
   * Set to `false` to hide the button from the Navbar while keeping the component and code intact.
   */
  ENABLE_INSPECTOR_BUTTON: false,
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

/**
 * Easily customizable configuration for Raindrop Ripples
 */
export const RAINDROP_RIPPLE_CONFIG = {
  /**
   * Frequency of rain drops in milliseconds [min, max] between spawns.
   * - [150, 400]: torrential / heavy rain
   * - [350, 750]: steady gentle shower (Default)
   * - [800, 1600]: slow sporadic drizzle
   */
  SPAWN_INTERVAL_MS: [350, 750] as const,

  /**
   * Speed of the ripple in seconds (how long each droplet takes to expand and dissipate).
   * - 1.0s: brisk / rapid splash
   * - 1.6s: natural water ripple expansion (Default)
   * - 2.5s: slow, lingering ethereal rings
   */
  RIPPLE_DURATION_SEC: 1.6,

  /**
   * Size range of the ripple in pixels [min, max].
   * Each droplet randomly picks its final expanded diameter within this range.
   */
  SIZE_RANGE_PX: [150, 300] as const,

  /**
   * Maximum concurrent ripples active on screen to guarantee 60fps performance.
   */
  MAX_CONCURRENT_DROPS: 12,
} as const;

/**
 * Easily customizable configuration for Pointer Light Ping-Pong Ripple
 */
export const POINTER_LIGHT_CONFIG = {
  /**
   * Duration of one full expansion-and-contraction cycle in seconds (speed).
   * - 1.2s: brisk energetic pulse
   * - 2.0s: smooth fluid breathing wave (Default)
   * - 3.5s: slow, calm ambient radar wave
   */
  CYCLE_DURATION_SEC: .5,

  /**
   * Maximum expansion radius in pixels (the wave ring expands to this distance before reversing).
   */
  MAX_RADIUS_PX: 150,

  /**
   * Minimum contraction radius in pixels (the contracted inner ring).
   */
  MIN_RADIUS_PX: 20,

  /**
   * Thickness of the ripple ring wavefront stroke in pixels.
   * - 2px: razor-sharp delicate line
   * - 5px: crisp defined wireframe wave (Default)
   * - 10px: thick luminous neon ring
   */
  THICKNESS_PX: 18,
} as const;

