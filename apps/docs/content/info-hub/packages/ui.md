---
title: "UI Package"
description: "Component library following Atomic Design principles"
category: "info-hub/packages"
order: 1
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-25"
---

# `@repo/ui` ⚛️

Shared component library adhering to Atomic Design principles (Atoms, Molecules, Organisms).

## Structure

- **Atoms**: Basic UI primitives (`ThemeInitializer`).
- **Molecules**: Interactive UI controls (`ThemeSwitcher`, `ColorPicker`).
- **Organisms**: Complex navigation and section blocks (`Navbar`).

## Installation / Import

```typescript
import { Navbar, ThemeInitializer, ThemeSwitcher, ColorPicker } from "@repo/ui";
```

```css
@import "@repo/ui/styles/themes/index.css";
```
