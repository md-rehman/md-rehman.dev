---
title: "Package Extraction: react-native-ruler-date-picker"
description: "Roadmap and extraction plan to turn DateRulerV3 into standalone open-source NPM packages (react-native-ruler-date-picker & react-native-ruler-picker)"
category: "planning/todo"
order: 2
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-05"
---

# Extraction Plan: `react-native-ruler-date-picker` 📐📅

## 1. Executive Summary

This document details the roadmap for extracting [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx) from `apps/companion-expo` into a standalone, premium open-source NPM package.

### Target Package Names & Scope Strategy
1. **Primary Package (`react-native-ruler-date-picker`)**:
   - Focused explicitly on dates, timelines, and calendar scrolling.
   - Key differentiators: 60 FPS Reanimated 3 physics + decay snapping, dual-speed haptic feedback engine (fast continuous buzz vs slow discrete ticks), and windowed tick rendering.
2. **Future Broader Package (`react-native-ruler-picker`)**:
   - Generic numeric ruler engine (e.g., weight, height, age, currency, custom scales).
   - `react-native-ruler-date-picker` will eventually wrap this core engine.

---

## 2. Monorepo Source Component Audit

Reference component: [DateRulerV3.tsx](file:///Users/rehman/Documents/Nebula/md-rehman.dev/repo/md-rehman.dev/apps/companion-expo/components/DateRulerV3.tsx)

### Required Decoupling Tasks:
- [ ] **Remove Monorepo Theme Context**: Eliminate `useTheme()` dependency from `../context/ThemeContext` (Lines 13, 108). Replace with explicit style props and fallback to `useColorScheme()`.
- [ ] **Remove App-Specific Date Utility**: Replace `getLocalYYYYMMDD` (Line 14) with a lightweight, zero-dependency internal date formatting utility.
- [ ] **Generalize Hardcoded Day Highlighting**: Replace hardcoded Friday highlighting (`isFriday: d.getDay() === 5`, Line 152) with customizable callback/props (`highlightDays`, `labelInterval`).
- [ ] **Dynamic Date Boundaries**: Replace hardcoded `DAY_RANGE = 365` (Line 19) with `minDate` and `maxDate` boundary props.
- [ ] **Decouple Expo Haptics Dependency**: Wrap `expo-haptics` gracefully so pure React Native CLI apps can use the library without hard errors or pass custom haptic triggers via prop (`onHapticTrigger`).

---

## 3. Package API Design

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

## 4. Extraction & Publishing Checklist

### Phase 1: Refactoring in Workspace
- [ ] Create clean, standalone component draft with generic props.
- [ ] Test in `apps/companion-expo` to ensure zero regressions.

### Phase 2: Standalone Repository Setup
- [ ] Initialize repository with `react-native-builder-bob` or `tsup`.
- [ ] Configure `peerDependencies` (`react`, `react-native`, `react-native-reanimated`, `react-native-gesture-handler`).
- [ ] Make `expo-haptics` an `optionalPeerDependencies`.

### Phase 3: Expo & React Native CLI Compatibility
- [ ] Verify 60 FPS performance on iOS Simulator & Android Emulator.
- [ ] Test dual-speed haptic response on physical iOS & Android devices.
- [ ] Add React Native Web support / fallback.

### Phase 4: Release & Documentation
- [ ] Write rich README with visual GIFs, code snippets, and live Snack demo.
- [ ] Publish v1.0.0 to NPM under `react-native-ruler-date-picker`.
