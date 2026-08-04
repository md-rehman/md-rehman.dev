---
title: "Companion Expo: Theming Color Picker & Text Color Customization"
description: "Implementation of cross-platform color picker and customizable text color with calculated text shades in companion-expo"
category: "planning/in-progress"
order: 2
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-31"
---

# Companion Expo — Theming Color Picker & Text Color Customization 🎨

This document tracks the implementation of the **Color Picker** and **Customizable Text Colors** in the `apps/companion-expo` application.

---

## 🚀 Feature Overview

1. **Customizable Text Colors (`fgPrimary`)**: Users can customize the primary text color in custom themes.
2. **Derived Text Shades**: `fgSecondary` and `fgMuted` are dynamically calculated based on `fgPrimary`, `bgPrimary`, and `accentPrimary`.
3. **Cross-Platform Color Picker Component**: A visual color picker supporting hex input, quick swatch palette grid, hue/spectrum selector, and native web color input.
4. **Theme Context Persistence**: Custom `bgPrimary`, `accentPrimary`, and `fgPrimary` choices are persisted in `AsyncStorage`.

---

## 📂 Planned Files & Architecture

| File Path | Action | Description |
| :--- | :--- | :--- |
| `apps/companion-expo/constants/theme.ts` | Modify | `deriveColors` calculation for derived text shades (`fgPrimary`, `fgSecondary`, `fgMuted`). |
| `apps/companion-expo/context/ThemeContext.tsx` | Modify | Update `setCustomColors` and `AsyncStorage` persistence for `(bgPrimary, accentPrimary, fgPrimary)`. |
| `apps/companion-expo/components/ui/ColorPicker.tsx` | New | Reusable visual color picker with swatches, hex text input, hue spectrum, and native web input. |
| `apps/companion-expo/app/(tabs)/theming.tsx` | Modify | Color picker integration for Background, Accent, and Text colors + full text shades preview. |
