# Package Extraction: `react-native-ruler-date-picker` 📐📅

Extract [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx) from `companion-expo` into a standalone, open-source pnpm + Turborepo monorepo at [react-native-ruler-date-picker](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker). The repo already has a git remote (`git@github.com:md-rehman/react-native-ruler-date-picker.git`), MIT LICENSE, and a blank README.

---

## Decisions Confirmed

| Decision | Resolution |
|---|---|
| Package Manager | **pnpm** workspaces + Turborepo |
| Build Tooling | **create-react-native-library** (uses react-native-builder-bob) |
| Session Scope | **Phase 1 + Phase 2** only; follow-up tracking files for Phase 3-4 |
| Docs Tech Stack | **Fumadocs** (placeholder scaffold in Phase 1) |
| Publishing | Deferred to a future session |

---

## Open Question: npm Package Scope

> [!NOTE]
> Publishing is deferred, but here's the analysis for when you're ready:

| Approach | Pros | Cons |
|---|---|---|
| **Unscoped** `react-native-ruler-date-picker` | Maximum npm search discoverability; shorter import path; feels like a "community" package; easier for SEO ranking on npm | Name could be taken by someone else if you wait too long; no namespace grouping if you publish more packages later |
| **Scoped** `@md-rehman/react-native-ruler-date-picker` | Guaranteed name availability under your scope; groups all your packages under one namespace; professional publisher branding | Longer import path; scoped packages are slightly less discoverable in npm search; requires npm org setup (free) |

> [!TIP]
> **Recommendation**: Go **unscoped** (`react-native-ruler-date-picker`) for the primary package — it matches the repo name, maximizes discoverability, and aligns with how popular RN libraries are published (`react-native-reanimated`, `react-native-gesture-handler`, etc.). If you later publish the generic `react-native-ruler-picker`, it naturally lives alongside it in npm search. You can always reserve the scoped name as well.

---

## Proposed Changes

### Phase 1: Workspace Bootstrapping

---

#### Root Monorepo Configuration

##### [NEW] [package.json](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/package.json)
Root `package.json` with pnpm workspace configuration:
- `"private": true`
- `"packageManager": "pnpm@9.x"`
- Scripts: `dev`, `build`, `lint`, `typecheck`
- No direct dependencies — all in workspaces

##### [NEW] [pnpm-workspace.yaml](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/pnpm-workspace.yaml)
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

##### [NEW] [turbo.json](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/turbo.json)
Turborepo task config:
- `build`: depends on `^build`, outputs `lib/**`
- `dev`: persistent, no cache
- `lint` / `typecheck`: cacheable

##### [NEW] [.gitignore](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/.gitignore)
Standard ignores for node_modules, lib/, .turbo/, .expo/, etc.

##### [NEW] [tsconfig.base.json](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/tsconfig.base.json)
Shared TypeScript config with strict mode, React Native JSX settings.

##### [NEW] [.npmrc](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/.npmrc)
```ini
auto-install-peers=true
strict-peer-dependencies=false
```

##### [MODIFY] [README.md](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/README.md)
Replace the single-line placeholder with a proper open-source README containing:
- Hero banner area (placeholder for now)
- Feature highlights (60 FPS physics, dual-speed haptics, windowed rendering)
- Installation instructions
- Quick start code example
- API reference table
- Contributing section
- License badge

---

#### Core Library Package: `packages/react-native-ruler-date-picker`

##### [NEW] [packages/react-native-ruler-date-picker/package.json](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/package.json)
Published package config:
- `"name": "react-native-ruler-date-picker"`
- `"version": "0.1.0"`
- `"main"` / `"module"` / `"types"` pointing to `lib/`
- Peer dependencies: `react`, `react-native`, `react-native-reanimated` (≥3.0), `react-native-gesture-handler` (≥2.0)
- Optional peer: `expo-haptics`
- Dev dependencies: `react-native-builder-bob`, `typescript`
- `"react-native-builder-bob"` config for CommonJS + ESM + TypeScript declarations

##### [NEW] [packages/react-native-ruler-date-picker/tsconfig.json](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/tsconfig.json)
Extends `tsconfig.base.json`, includes `src/**/*`.

##### [NEW] [packages/react-native-ruler-date-picker/src/index.ts](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/index.ts)
Public API barrel export:
```ts
export { RulerDatePicker } from './RulerDatePicker';
export type { RulerDatePickerProps } from './types';
```

##### [NEW] [packages/react-native-ruler-date-picker/src/types.ts](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/types.ts)
Full `RulerDatePickerProps` interface — expanded with all decoupled constants:

```ts
export interface RulerDatePickerProps {
  // ── Selection & Bounds ─────────────────────────────────────
  selectedDate: Date | string;
  onSelectDate: (date: Date, dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;

  // ── Label & Highlight Rules ────────────────────────────────
  labelInterval?: 'daily' | 'weekly' | 'monthly' | ((date: Date) => boolean);
  highlightDays?: number[];  // e.g. [0, 6] for weekends

  // ── Tick Dimensions ────────────────────────────────────────
  tickSpacing?: number;          // default: 24 — gap between ticks
  tickHeight?: number;           // default: 12 — small tick height
  tickTallHeight?: number;       // default: 24 — large/labeled tick height
  tickThickness?: number;        // default: 4  — tick bar width

  // ── Tick Colors (small & large independently) ──────────────
  tickColor?: string;            // small tick color
  tickTallColor?: string;        // large/labeled tick color (falls back to tickColor)

  // ── Label & Accent Colors ─────────────────────────────────
  labelColor?: string;           // date label text color
  accentColor?: string;          // today dot + reset button color
  indicatorColor?: string;       // center selection indicator color
  backgroundColor?: string;      // component background

  // ── Layout Dimensions ─────────────────────────────────────
  height?: number;               // default: 120 — total component height
  rulerHeight?: number;          // default: 60  — ruler track height
  indicatorWidth?: number;       // default: 2   — center indicator bar width
  indicatorHeight?: number;      // default: 40  — center indicator bar height
  todayDotSize?: number;         // default: 6   — today indicator dot diameter
  labelFontSize?: number;        // default: 10  — tick label font size

  // ── Performance Tuning ────────────────────────────────────
  bufferTicks?: number;          // default: 10  — off-screen tick render buffer
  updateDebounceMs?: number;     // default: 100 — debounce ms for onSelectDate

  // ── Haptic Tuning ─────────────────────────────────────────
  enableHaptics?: boolean;                          // default: true
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  fastSwipeTickThreshold?: number;                  // default: 1
  continuousHapticIntervalMs?: number;              // default: 20

  // ── Reset Control ─────────────────────────────────────────
  showResetToToday?: boolean;    // default: false

  // ── Custom Renderers ──────────────────────────────────────
  renderHeader?: (
    selectedDate: Date,
    isToday: boolean,
    resetToToday: () => void
  ) => React.ReactNode;
}
```

##### [NEW] [packages/react-native-ruler-date-picker/src/RulerDatePicker.tsx](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/RulerDatePicker.tsx)
**Core component** — refactored from [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx) with the full decoupling table below.

##### [NEW] [packages/react-native-ruler-date-picker/src/Tick.tsx](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/Tick.tsx)
Extracted `Tick` memoized sub-component — `isFriday` generalized to `isLabeled` (driven by `labelInterval`), separate `tickColor`/`tickTallColor` support.

##### [NEW] [packages/react-native-ruler-date-picker/src/utils.ts](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/utils.ts)
Internal utilities:
- `formatDateString(date: Date): string` — replaces `getLocalYYYYMMDD`, zero-dep YYYY-MM-DD formatter
- `dateToDayOffset(date: Date | string, referenceTime: number): number`
- `dayOffsetToDate(offset: number, referenceTime: number): Date`

##### [NEW] [packages/react-native-ruler-date-picker/src/useHaptics.ts](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/useHaptics.ts)
Haptics abstraction hook:
- Attempts to dynamically `require('expo-haptics')` wrapped in `try/catch`
- Falls back to no-op if `expo-haptics` is not installed
- If `onHapticTrigger` prop is provided, delegates to it instead
- Exposes `fireDiscreteHaptic()`, `startContinuousHaptic()`, `stopContinuousHaptic()`
- Accepts `fastSwipeTickThreshold` and `continuousHapticIntervalMs` as configurable params

##### [NEW] [packages/react-native-ruler-date-picker/src/defaults.ts](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/packages/react-native-ruler-date-picker/src/defaults.ts)
All constants extracted as named defaults with light/dark color palettes:

```ts
// Internal constants (not user-configurable)
export const MS_PER_DAY = 86_400_000;

// User-configurable defaults
export const DEFAULTS = {
  tickSpacing: 24,
  tickHeight: 12,
  tickTallHeight: 24,
  tickThickness: 4,
  height: 120,
  rulerHeight: 60,
  indicatorWidth: 2,
  indicatorHeight: 40,
  todayDotSize: 6,
  labelFontSize: 10,
  bufferTicks: 10,
  updateDebounceMs: 100,
  fastSwipeTickThreshold: 1,
  continuousHapticIntervalMs: 20,
  enableHaptics: true,
  showResetToToday: false,
} as const;

export const LIGHT_COLORS = {
  tickColor: '#D1D5DB',
  tickTallColor: '#9CA3AF',
  labelColor: '#6B7280',
  accentColor: '#3B82F6',
  indicatorColor: '#3B82F6',
  backgroundColor: 'transparent',
};

export const DARK_COLORS = {
  tickColor: '#4B5563',
  tickTallColor: '#6B7280',
  labelColor: '#9CA3AF',
  accentColor: '#60A5FA',
  indicatorColor: '#60A5FA',
  backgroundColor: 'transparent',
};
```

---

#### Full Decoupling Table

Every hardcoded value in the source component mapped to its decoupled prop:

| Source Location | Original Hardcoded Value | Decoupled Prop | Default |
|---|---|---|---|
| L108 | `useTheme()` → `colors.*` | `tickColor`, `tickTallColor`, `labelColor`, `accentColor`, `indicatorColor`, `backgroundColor` | Auto light/dark palette via `useColorScheme()` |
| L14 | `getLocalYYYYMMDD` from `../utils/date` | Internal `formatDateString()` | — (zero-dep) |
| L152 | `isFriday: d.getDay() === 5` | `labelInterval` prop | `'weekly'` |
| L19 | `DAY_RANGE = 365` | `minDate` / `maxDate` | ±365 days from today |
| L3 | `import * as Haptics from 'expo-haptics'` | Dynamic require + `onHapticTrigger` + `enableHaptics` | Auto-detect expo-haptics |
| L36 | `onSelectDate: (d: string) => void` | `onSelectDate: (date: Date, dateString: string) => void` | — |
| L37 | `tickSpacing = 24` | `tickSpacing` prop | `24` |
| L38 | `tickHeight = 12` | `tickHeight` prop | `12` |
| L39 | `tickTallHeight = 24` | `tickTallHeight` prop | `24` |
| L40 | `tickThickness = 4` | `tickThickness` prop | `4` |
| L374 | `tickColor={colors.cardBorder}` (same for both) | `tickColor` + `tickTallColor` (independent) | Light: `#D1D5DB` / `#9CA3AF` |
| L388 | `height: 120` (container) | `height` prop | `120` |
| L427 | `height: 60` (ruler container) | `rulerHeight` prop | `60` |
| L436 | `width: 2` (center indicator) | `indicatorWidth` prop | `2` |
| L437 | `height: 40` (center indicator) | `indicatorHeight` prop | `40` |
| L458-460 | `width: 6, height: 6` (today dot) | `todayDotSize` prop | `6` |
| L454 | `fontSize: 10` (tick label) | `labelFontSize` prop | `10` |
| L23 | `BUFFER_TICKS = 10` | `bufferTicks` prop | `10` |
| L20 | `UPDATE_DEBOUNCE_MS = 100` | `updateDebounceMs` prop | `100` |
| L28 | `FAST_SWIPE_TICK_THRESHOLD = 1` | `fastSwipeTickThreshold` prop | `1` |
| L32 | `CONTINUOUS_HAPTIC_INTERVAL_MS = 20` | `continuousHapticIntervalMs` prop | `20` |
| Header rendering | Hardcoded date/year header | `renderHeader` prop | Built-in default header |

---

#### Example App: `apps/example`

##### [NEW] `apps/example/` (Expo app)
- Created via `npx create-expo-app@latest`
- Links to `react-native-ruler-date-picker` via pnpm workspace protocol
- Minimal `App.tsx` rendering `<RulerDatePicker />` with basic state
- Metro config with workspace resolution

---

#### Storybook App: `apps/storybook` (Scaffold only)

##### [NEW] `apps/storybook/` (Placeholder)
- Scaffold the Storybook v8 Expo app structure
- Add `@storybook/react-native` dependencies
- Create 1 initial story: `RulerDatePicker.stories.tsx` (Default configuration)
- Full story suite deferred to Phase 3

---

#### Docs Site: `apps/docs` (Scaffold only)

##### [NEW] `apps/docs/` (Fumadocs placeholder)
- Scaffold a Next.js + Fumadocs app skeleton
- Add one placeholder page with a "Coming Soon" note
- Full docs content deferred to Phase 4

---

### Phase 2: Core Refactoring & Extraction

Implemented inside `packages/react-native-ruler-date-picker/src/` during this session.

#### Decoupling Tasks

##### 1. Remove Theme Context Dependency
- Replace `const { colors } = useTheme()` with prop-based color resolution
- `resolveColors()` merges user-provided color props with auto-detected light/dark defaults
- Small ticks and large/labeled ticks are independently colorable via `tickColor` / `tickTallColor`

##### 2. Replace `getLocalYYYYMMDD`
- Inline the identical logic into `utils.ts` as `formatDateString()`
- Zero-dep isolation, no behavior change

##### 3. Generalize Day Highlighting → `labelInterval`
- Replace `isFriday` with `isLabeled` computed from `labelInterval` prop:
  - `'daily'` → every tick gets a label
  - `'weekly'` (default) → every 7th day
  - `'monthly'` → 1st of each month
  - `(date: Date) => boolean` → custom callback

##### 4. Dynamic Date Boundaries → `minDate` / `maxDate`
- Replace `DAY_RANGE = 365` with computed range from props
- Clamp translateX within `[minOffset, maxOffset]` in pan gesture + decay
- Default: ±365 days from today

##### 5. Graceful Haptics Decoupling
- `useHaptics` hook with dynamic `require('expo-haptics')` + try/catch
- `enableHaptics` prop (default `true`)
- `onHapticTrigger` prop for custom haptic implementations
- `fastSwipeTickThreshold` and `continuousHapticIntervalMs` are now configurable props
- Pure RN CLI projects without expo-haptics get silent no-ops

##### 6. Callback Signature Enhancement
- Current: `onSelectDate(dateString: string)`
- New: `onSelectDate(date: Date, dateString: string)`

##### 7. Full Constant Extraction
- All hardcoded layout dimensions (`height`, `rulerHeight`, `indicatorWidth`, `indicatorHeight`, `todayDotSize`, `labelFontSize`) exposed as props
- All performance tuning constants (`bufferTicks`, `updateDebounceMs`) exposed as props
- All values fall back to sensible defaults from `defaults.ts`

---

## Follow-Up Tracking

These files will be created in the repo to track remaining phases:

##### [NEW] [ROADMAP.md](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/ROADMAP.md)
Top-level roadmap linking to the follow-up phase files.

##### [NEW] [docs/phase-3-storybook-kitchensink.md](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/docs/phase-3-storybook-kitchensink.md)
Phase 3 checklist:
- [ ] Full Storybook story suite (Dark Mode, Custom Colors, Custom Label Intervals, Min/Max Boundaries, Disabled Haptics, Custom Haptic Handlers, Custom Header Renderers)
- [ ] Build `apps/kitchensink` Expo showcase (fitness logger, event picker, custom themes)
- [ ] 60 FPS performance verification (iOS Simulator + Android Emulator)
- [ ] Physical device haptic testing
- [ ] React Native Web support + Storybook web view fallback

##### [NEW] [docs/phase-4-release-publishing.md](file:///Users/rehman/Documents/Nebula/react-native-ruler-date-picker/react-native-ruler-date-picker/docs/phase-4-release-publishing.md)
Phase 4 checklist:
- [ ] Publish Fumadocs documentation site to Vercel
- [ ] Add interactive GIFs + Storybook link to README
- [ ] npm scope decision (scoped vs unscoped — pros/cons above)
- [ ] Publish v1.0.0 to npm
- [ ] Set up GitHub Actions CI (build, lint, typecheck)
- [ ] Add CHANGELOG.md with changesets or standard-version

---

## Verification Plan

### Automated Tests
```bash
# From monorepo root
pnpm build          # Verify bob builds CJS + ESM + .d.ts
pnpm typecheck      # Verify no TypeScript errors across workspaces
pnpm lint           # Verify linting passes
```

### Manual Verification
- Run `apps/example` Expo app on iOS Simulator
- Verify ruler renders with default props (no crashes, correct date display)
- Verify haptics work when `expo-haptics` is present
- Verify no errors when `expo-haptics` is absent
- Verify `tickColor` and `tickTallColor` independently control small vs large ticks
- Verify custom layout props (`height`, `rulerHeight`, `indicatorWidth`, etc.) override defaults
- Verify `minDate` / `maxDate` correctly clamp scrolling
- Verify `labelInterval` variations (`'daily'`, `'weekly'`, `'monthly'`)
- Storybook: verify the default story renders

---

## File Tree Summary

```
react-native-ruler-date-picker/
├── LICENSE                              # ✅ Already exists (MIT)
├── README.md                            # MODIFY — full open-source README
├── ROADMAP.md                           # NEW — phase tracking overview
├── package.json                         # NEW — root monorepo config
├── pnpm-workspace.yaml                  # NEW
├── turbo.json                           # NEW
├── tsconfig.base.json                   # NEW
├── .npmrc                               # NEW
├── .gitignore                           # NEW
├── docs/
│   ├── phase-3-storybook-kitchensink.md # NEW — Phase 3 tracking
│   └── phase-4-release-publishing.md    # NEW — Phase 4 tracking
├── packages/
│   └── react-native-ruler-date-picker/
│       ├── package.json                 # NEW — published npm package
│       ├── tsconfig.json                # NEW
│       └── src/
│           ├── index.ts                 # NEW — barrel export
│           ├── types.ts                 # NEW — public types (full props interface)
│           ├── RulerDatePicker.tsx       # NEW — main component (refactored)
│           ├── Tick.tsx                  # NEW — memoized tick sub-component
│           ├── useHaptics.ts            # NEW — haptics abstraction hook
│           ├── utils.ts                 # NEW — date utilities
│           └── defaults.ts              # NEW — constants & default color palettes
├── apps/
│   ├── example/                         # NEW — minimal Expo dev app
│   ├── storybook/                       # NEW — Storybook v8 scaffold
│   └── docs/                            # NEW — Fumadocs placeholder
```
