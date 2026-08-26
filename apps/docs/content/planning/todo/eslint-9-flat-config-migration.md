---
title: "Monorepo-wide ESLint 9 Flat Config Migration"
description: "Migrate remaining monorepo apps and packages from ESLint 8 legacy config to ESLint 9 Flat Config"
category: "planning/todo"
order: 12
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-25"
---

# Task: Monorepo-wide ESLint 9 Flat Config Migration 🧹

## Objective
Standardize ESLint across the monorepo to ESLint v9 (`^9.x`) with Flat Configuration (`eslint.config.mjs` / `eslint.config.js`). Currently, `companion` and `planner` are on ESLint 9, while `home`, `tv-set`, `docs`, and `@repo/*` packages use ESLint 8 (`^8.57.0`).

## Scope of Changes
- Upgrade `eslint` to `^9.x` across `docs`, `home`, `tv-set`, `md-rehman.dev`, `@repo/auth`, `@repo/build-plugins`, `@repo/docs-core`, `@repo/shell`, `@repo/ui`, and `@repo/eslint-config`.
- Migrate legacy `.eslintrc.js` files to flat config `eslint.config.mjs` using `@eslint/js` and `@typescript-eslint/eslint-plugin`.
- Update `@repo/eslint-config` shared presets for Next.js, React, and base TypeScript configs to support Flat Config format.

## Planned Execution Steps
1. Refactor `@repo/eslint-config` exports for flat config format.
2. Upgrade `eslint` dependencies in all target packages and apps.
3. Replace `.eslintrc.js` with `eslint.config.mjs` in `docs`, `home`, `tv-set`, and `@repo/*`.
4. Run `npx turbo run lint` to verify all apps lint cleanly without warnings or errors.
