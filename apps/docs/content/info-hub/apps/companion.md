---
title: "Companion App"
description: "Personal AI companion, prayer tracker, and daily planner web app"
category: "info-hub/apps"
order: 1
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-24"
---

# Companion Web Application 📱

The **Companion** app is a personal assistant web application built with Next.js App Router, Supabase, and custom UI components. It features a daily prayer tracker, habit logging, date rulers, and interactive dashboards.

> [!NOTE]
> companion runs locally on port `3012` and shares authentication state with `@repo/auth`.

## Key Features

- **Prayer Tracker**: Radial and horizontal visualizations for tracking daily prayers (`usePrayerTracker.ts`).
- **Date Ruler Component**: Dynamic date navigation carousel with smooth snapping and haptic feedback.
- **Server Actions & Supabase**: Real-time state persistence with Supabase SSR client.

## Quick Start

```bash
yarn dev --filter=companion
```

## Architecture Overview

```typescript
// Example usage of server client in companion
import { createClient } from "@repo/auth/server";

export async function addPrayer(prayerName: string) {
  const supabase = await createClient();
  // ... Handle database persistence
}
```

---

### Related Projects

- `companion-expo`: Mobile companion application for iOS & Android.
- `@repo/auth`: Supabase authentication helpers.
