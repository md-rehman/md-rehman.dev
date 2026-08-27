---
title: "Monorepo-wide ESLint 9 Flat Config Migration"
description: "Migrate monorepo apps and packages from ESLint 8 legacy config to ESLint 9 Flat Config"
category: "planning/done"
order: 12
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-26"
---

# Task: Monorepo-wide ESLint 9 Flat Config Migration 🧹

## Objective
Standardize ESLint across the monorepo to ESLint v9 (`^9.x`) with Flat Configuration (`eslint.config.mjs`).

## Scope of Changes
- Upgraded `eslint` to `^9.0.0` across `docs`, `home`, `tv-set`, `companion`, `planner`, `companion-expo`, `@repo/auth`, `@repo/build-plugins`, `@repo/docs-core`, `@repo/shell`, `@repo/ui`, and `@repo/eslint-config`.
- Migrated legacy `.eslintrc.js` files to flat config `eslint.config.mjs` using `@eslint/js`, `eslint-config-prettier`, and native `eslint-config-next` / `eslint-config-expo`.
- Refactored `@repo/eslint-config` shared presets (`next.js`, `library.js`, `react-internal.js`) for Flat Config array exports.
- Verified monorepo-wide zero errors with `npx turbo run lint build`.
