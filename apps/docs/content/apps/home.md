---
title: "Home Portal App"
description: "Central landing portal and Vercel rewrite gateway for all apps"
category: "apps"
order: 4
pinned: false
author: "md-rehman"
updatedAt: "2026-07-24"
---

# Home Portal App 🌐

The **Home** app serves as the primary landing page and reverse-proxy hub (`apps/home/vercel.json`) connecting all sub-applications under `md-rehman.dev`.

> [!NOTE]
> Runs on port `4000`.

## Architecture & Rewrites

Vercel rewrites forward subpaths to individual micro-apps:
- `/tv-set` ➔ `tv-set` app
- `/companion` ➔ `companion` app
- `/planner` ➔ `planner` app
- `/docs` ➔ `docs` app
