---
title: "Companion Expo: Theming Color Picker & Text Color Customization"
description: "Implementation summary of cross-platform color picker and customizable text color with calculated text shades in companion-expo"
category: "planning/done"
order: 2
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-31"
---

# Companion Expo — Theming Color Picker & Text Color Customization 🎨

This document summarizes the completed implementation of the **Color Picker** and **Customizable Text Colors** feature in `apps/companion-expo`.

---

## ✅ Implemented Features

1. **Text Color Customization (`fgPrimary`)**: Added full text color picker and customization to the custom theme builder.
2. **Calculated Text Color Shades**: `fgSecondary` and `fgMuted` text colors (and `badgeText`) are automatically derived and calculated from `fgPrimary`, `bgPrimary`, and `accentPrimary`.
3. **Dynamic Label & Component Updating**: All labels (`ColorPicker` headers, hex codes, input prefixes, input text, section headers, preset texts) subscribe to `useTheme()` and update dynamically in real time as text color changes.
4. **Cross-Platform ColorPicker Component (`ColorPicker.tsx`)**:
   - Visual color swatch palette grid for fast one-tap color selection.
   - Hex code text input field with automatic format validation.
   - Live color swatch preview badge.
   - Native browser color picker input (`<input type="color">`) integration for web.
5. **AsyncStorage Persistence**: User custom theme choices (`bgPrimary`, `accentPrimary`, `fgPrimary`) are stored in `AsyncStorage` and restored across app sessions.
6. **Theme Preview**: Updated `theming.tsx` with live previews for `fgPrimary`, `fgSecondary`, `fgMuted`, and `badgeText`.

---

## 📂 Created & Modified Files

| File Path | Description |
| :--- | :--- |
| `apps/companion-expo/components/ui/ColorPicker.tsx` | New reusable cross-platform color picker component using dynamic theme text colors (`fgSecondary`, `fgMuted`, `fgPrimary`, `bgTertiary`). |
| `apps/companion-expo/constants/theme.ts` | Updated `deriveColors` to calculate `fgSecondary`, `fgMuted`, and `badgeText` dynamically from `fgPrimary`. |
| `apps/companion-expo/context/ThemeContext.tsx` | Updated `setCustomColors`, `applyCustom`, and `AsyncStorage` persistence for custom `fgPrimary`. |
| `apps/companion-expo/app/(tabs)/theming.tsx` | Integrated `ColorPicker` for Background, Accent, and Text colors, plus live text shades preview. |

---

## ⚙️ Verification

```bash
# Typecheck passed with 0 errors:
npx tsc --noEmit --project apps/companion-expo/tsconfig.json
```
