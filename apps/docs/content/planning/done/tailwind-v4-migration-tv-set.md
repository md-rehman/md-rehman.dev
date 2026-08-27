---
title: "Tailwind CSS v4 Migration for tv-set"
description: "Migrate tv-set app from Tailwind v3 to Tailwind v4 CSS directives and PostCSS setup"
category: "planning/done"
order: 11
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-25"
---

# Task: Tailwind CSS v4 Migration for `tv-set` 🎨

## Objective
Upgrade `apps/tv-set` from Tailwind CSS v3 (`^3.4.1`) to Tailwind CSS v4 (`^4.1.11`) to match `apps/companion`.

## Scope of Changes
- `tailwindcss`: `^3.4.1` ➔ `^4.1.11`
- Update PostCSS plugin to `@tailwindcss/postcss`
- Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";` in `apps/tv-set` CSS files.
- Migrate `tailwind.config.js` options into CSS `@theme` block or CSS configuration.

## Planned Execution Steps
1. Update `package.json` dependencies for `tv-set`.
2. Update `postcss.config.mjs`.
3. Update global CSS stylesheets in `apps/tv-set`.
4. Test UI rendering across `tv-set` pages to verify utility class compatibility.
