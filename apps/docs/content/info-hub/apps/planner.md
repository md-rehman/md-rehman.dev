---
title: "Planner App"
description: "Trello-like Kanban board and task management system"
category: "info-hub/apps"
order: 2
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-24"
---

# Planner Application 📋

The **Planner** app is a Trello-inspired project management dashboard built for managing tasks, boards, and workflows within the monorepo ecosystem.

> [!TIP]
> Runs on port `4002` locally. Accessible via `/planner` proxy path in production.

## Features

- **Kanban Board**: Drag-and-drop or state-driven column management (`Board.tsx`, `Column.tsx`, `Card.tsx`).
- **Color Coding**: Customizable card accent colors and status labels.
- **Supabase Integration**: Task synchronization via `@repo/auth`.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React Framework |
| React 19 | Client UI Rendering |
| `@repo/auth` | Authentication & User Context |
| `@repo/ui` | Core Atomic UI Elements |
