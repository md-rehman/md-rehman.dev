---
title: "Package Extraction: react-native-ruler-date-picker"
description: "Roadmap and extraction plan to turn DateRulerV3 into standalone open-source NPM packages (react-native-ruler-date-picker & react-native-ruler-picker) within a Storybook & Kitchensink monorepo"
category: "planning/todo"
order: 2
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-05"
---

# Extraction & Monorepo Plan: `react-native-ruler-date-picker` 📐📅

## 1. Executive Summary

This document details the architecture and roadmap for extracting [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx) from `apps/companion-expo` into a standalone, open-source **monorepo** under the **MIT License**.

### Target Package Names & Scope Strategy
1. **Primary Package (`react-native-ruler-date-picker`)**:
   - Focused explicitly on dates, timelines, and calendar scrolling.
   - Key differentiators: 60 FPS Reanimated 3 physics + decay snapping, dual-speed haptic feedback engine (fast continuous buzz vs slow discrete ticks), and windowed tick rendering.
2. **Future Broader Package (`react-native-ruler-picker`)**:
   - Generic numeric ruler engine (e.g., weight, height, age, currency, custom scales).
   - `react-native-ruler-date-picker` will eventually wrap this core engine package.

---

## 2. Monorepo Architecture

The repository will be structured as a modern pnpm / Turborepo monorepo to isolate component development, visual testing, and documentation right from day 1.

```
react-native-ruler-date-picker/
├── LICENSE                    # MIT License
├── package.json               # Root monorepo configuration (pnpm / Turborepo)
├── turbo.json                 # Build & dev orchestration
├── packages/
│   └── ruler-date-picker/     # Core NPM package source & build outputs
├── apps/
│   ├── storybook/             # React Native / Expo Storybook for isolated UI development
│   ├── docs/                  # Interactive documentation website & API reference
│   └── kitchensink/           # Expo showcase app (all themes, presets, and haptic controls)
```

### Monorepo Apps & Workspace Packages:
- **`packages/ruler-date-picker`**: Main published component library with TypeScript declarations, Reanimated 3 physics, and optional haptic hooks.
- **`apps/storybook`**: React Native Storybook (web & native views) for zero-app-overhead isolated component iteration, visual controls, and edge-case testing.
- **`apps/docs`**: Documentation site built with Next.js / Fumadocs including live interactive web previews and code copy widgets.
- **`apps/kitchensink`**: Real-world Expo application exhibiting every configuration (Dark/Light mode, custom tick colors, custom header renderers, min/max bounds, and haptic tuning).

---

## 3. Monorepo Source Component Audit

Reference component: [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx)

### Required Decoupling Tasks:
- [ ] **Remove Monorepo Theme Context**: Eliminate `useTheme()` dependency from `../context/ThemeContext` (Lines 13, 108). Replace with explicit style props and fallback to `useColorScheme()`.
- [ ] **Remove App-Specific Date Utility**: Replace `getLocalYYYYMMDD` (Line 14) with a lightweight, zero-dependency internal date formatting utility.
- [ ] **Generalize Hardcoded Day Highlighting**: Replace hardcoded Friday highlighting (`isFriday: d.getDay() === 5`, Line 152) with customizable callback/props (`highlightDays`, `labelInterval`).
- [ ] **Dynamic Date Boundaries**: Replace hardcoded `DAY_RANGE = 365` (Line 19) with `minDate` and `maxDate` boundary props.
- [ ] **Decouple Expo Haptics Dependency**: Wrap `expo-haptics` gracefully so pure React Native CLI apps can use the library without hard errors or pass custom haptic triggers via prop (`onHapticTrigger`).

---

## 4. Package API Design

```tsx
export interface RulerDatePickerProps {
  // Selection & Bounds
  selectedDate: Date | string;
  onSelectDate: (date: Date, dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;
  
  // Customization & Interval Rules
  labelInterval?: 'daily' | 'weekly' | 'monthly' | ((date: Date) => boolean);
  highlightDays?: number[]; // e.g. [0, 6] for weekends
  
  // Dimensions & Aesthetics
  tickSpacing?: number;
  tickHeight?: number;
  tickTallHeight?: number;
  tickThickness?: number;
  tickColor?: string;
  labelColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  
  // Haptics & Controls
  enableHaptics?: boolean;
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  showResetToToday?: boolean;
  
  // Custom Header & Renderers
  renderHeader?: (selectedDate: Date, isToday: boolean, resetToToday: () => void) => React.ReactNode;
}
```

---

## 5. Bootstrap & Extraction Roadmap

### Phase 1: Workspace Bootstrapping (Day 1)
- [ ] Initialize pnpm workspace & Turborepo configuration.
- [ ] Create **MIT License** file.
- [ ] Bootstrap `packages/ruler-date-picker` package skeleton with `react-native-builder-bob` / `tsup`.
- [ ] Bootstrap **`apps/storybook`** for isolated component development & visual story controls.
- [ ] Bootstrap **`apps/kitchensink`** Expo app linked to workspace package.
- [ ] Bootstrap **`apps/docs`** site skeleton.

### Phase 2: Core Refactoring & Storybook Development
- [ ] Extract and decouple [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx) into `packages/ruler-date-picker`.
- [ ] Create Storybook stories covering:
  - Default Date Ruler
  - Dark Mode & Custom Color Themes
  - Custom Label Intervals (Weekly / Monthly / Custom)
  - Custom Min/Max Boundaries
  - Disabled Haptics / Custom Haptic Handlers
- [ ] Verify isolated render performance and touch responsiveness in Storybook.

### Phase 3: Kitchensink Showcase & Cross-Platform Testing
- [ ] Build interactive presets in `apps/kitchensink` (fitness logger timeline, event picker, custom height/weight variations).
- [ ] Verify 60 FPS performance on iOS Simulator & Android Emulator.
- [ ] Test dual-speed haptic response on physical devices.
- [ ] Add React Native Web support & fallback testing in Storybook web view.

### Phase 4: Open Source Release & Publishing
- [ ] Publish documentation site to Vercel/GitHub Pages from `apps/docs`.
- [ ] Add interactive GIFs, Storybook link, and usage instructions to repository README.
- [ ] Publish v1.0.0 to NPM under `react-native-ruler-date-picker` under MIT License.
