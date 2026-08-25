# `@repo/ui` ⚛️

## Description
This package provides a comprehensive, reusable component library built upon the **Atomic Design** methodology (Atoms, Molecules, Organisms). It helps maintain consistent UI, UX, dynamic CSS themes, and component controls across all applications in the monorepo.

## Structure
- **Atoms (`src/atoms`):** Basic primitives (e.g. `ThemeInitializer`).
- **Molecules (`src/molecules`):** Interactive UI controls functioning together (e.g. `ThemeSwitcher`, `ColorPicker`).
- **Organisms (`src/organisms`):** Complex layout components (e.g. `Navbar`).
- **Styles (`src/styles/themes`):** CSS Design Tokens and Multi-Theme Stylesheets.

## Installation & Import

```typescript
import { Navbar, ThemeInitializer, ThemeSwitcher, ColorPicker } from "@repo/ui";
```

```css
@import "@repo/ui/styles/themes/index.css";
```
