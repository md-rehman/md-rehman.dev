---
title: "Pinned Summary & Architectural Memory"
description: "High-level summary of monorepo architecture, god nodes, and memory items for AI agents"
category: "agents"
order: 1
pinned: true
author: "Antigravity AI"
updatedAt: "2026-07-24"
---

# Pinned Summary & Agent Memory 🧠

This document maintains critical system context, monorepo dependency hubs, and architectural rules for AI coding assistants working in **md-rehman.dev**.

> [!IMPORTANT]
> Always check `graphify-out/GRAPH_REPORT.md` before making architectural decisions or proposing refactors.

## Monorepo Hubs & Architecture

- **Root Framework**: Turborepo + Yarn 1.22 Workspaces.
- **Port Registry**:
  - `home`: Port `4000`
  - `companion`: Port `3012`
  - `planner`: Port `4002`
  - `tv-set`: Port `3011`
  - `docs`: Port `4003`
- **Core Abstractions**:
  - `createClient()` (`packages/auth/src/server.ts`): Primary Supabase server handler.
  - `@repo/ui`: Shared UI elements.
  - `@repo/docs-core`: Markdown document processing.

## Crucial Agent Guidelines

1. **Always Share an Implementation Plan**: Submit `implementation_plan.md` artifact before making non-trivial modifications.
2. **Never Guess Code Logic or File Paths**: Always inspect authoritative source code.
3. **No Superficial Symptom Patches**: Resolve underlying root causes instead of suppressing error boundaries.
