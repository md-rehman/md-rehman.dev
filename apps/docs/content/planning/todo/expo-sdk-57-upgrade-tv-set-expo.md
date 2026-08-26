---
title: "Expo SDK 57 Upgrade for tv-set-expo"
description: "Upgrade tv-set-expo from Expo SDK 56 track to SDK 57 track to align with companion-expo"
category: "planning/todo"
order: 10
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-25"
---

# Task: Expo SDK 57 Upgrade for `tv-set-expo` 📱

## Objective
Upgrade `apps/tv-set-expo` from Expo SDK 56 (`react-native` 0.85.3, `expo` ~56.0.12) to Expo SDK 57 (`react-native` 0.86.0, `expo` ~57.0.4) to align with `apps/companion-expo`.

## Scope of Version Changes
- `expo`: `~56.0.12` ➔ `~57.0.4`
- `react-native`: `0.85.3` ➔ `0.86.0`
- `react-native-reanimated`: `4.3.1` ➔ `4.5.0`
- `react-native-gesture-handler`: `~2.24.0` ➔ `~2.32.0`
- `react-native-worklets`: `0.8.3` ➔ `0.10.0`
- `@expo/metro-runtime`: `^56.0.15` ➔ `~57.0.3`
- `@expo/log-box`: `^56.0.13` ➔ `~57.0.0`
- `expo-router`: `~56.2.11` ➔ `~57.0.4`
- `expo-constants`: `~56.0.18` ➔ `~57.0.3`
- `expo-font`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-symbols`, `expo-web-browser`: align to SDK 57 series.

## Planned Execution Steps
1. Run `npx expo install --fix` within `apps/tv-set-expo`.
2. Verify Metro bundler startup with Expo SDK 57.
3. Validate gesture handler and reanimated animation worklets on tv-set views.
