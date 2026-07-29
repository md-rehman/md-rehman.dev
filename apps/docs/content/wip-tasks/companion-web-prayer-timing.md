---
title: "Companion Web: Prayer Timing Feature"
description: "Implementation summary of Aladhan API integration, live next-prayer countdown timer, and web notifications in the Companion web app"
category: "wip-tasks"
order: 1
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-26"
---

# Companion Web — Prayer Timing Feature Summary 🕌

This document provides a comprehensive technical reference for the **Prayer Timing Feature** implemented in the `apps/companion` Next.js web application. AI agents and developers can refer to this document for implementation details, architecture, and logic when modifying or extending prayer functionality.

---

## 🚀 Feature Overview

1. **Aladhan API Integration**: Fetches daily prayer timings dynamically based on user geolocation (or Mecca fallback).
2. **Next Prayer Countdown Timer**: Displays a live hero countdown timer (`HH:MM:SS`), start time, and progress bar for the upcoming prayer on the home screen.
3. **Browser Prayer Notifications**: Triggers browser Web Notifications and a Web Audio chime when a prayer time starts.
4. **Enhanced Radial Tracker**: Highlights the next upcoming prayer node and shows exact prayer timing tooltips.

---

## 📂 Key Files & Architecture

| File Path | Description |
| :--- | :--- |
| `apps/companion/src/hooks/usePrayerTimings.ts` | Custom hook fetching Aladhan API, parsing timings, determining `nextPrayer`, and ticking countdown. |
| `apps/companion/src/hooks/usePrayerNotifications.ts` | Hook managing Notification API permissions, scheduling alerts, and playing Web Audio chimes. |
| `apps/companion/src/components/page/home/NextPrayerTimer.tsx` | Hero timer card component rendering location, alert toggle, countdown, and 5-prayer schedule. |
| `apps/companion/src/components/page/home/NextPrayerTimer.module.css` | Styling & glassmorphism theme for the NextPrayerTimer widget. |
| `apps/companion/src/components/page/home/PrayerTrackerRadial.tsx` | Circular 5-node prayer status tracker updated with timing tooltips & active prayer highlight. |
| `apps/companion/src/components/page/home/HomeClient.tsx` | Assembles DateRuler, NextPrayerTimer, PrayerTrackerRadial, and AppTray into the home layout. |

---

## ⚙️ Core Logic & Data Flow

### 1. API Integration (`usePrayerTimings.ts`)
- **API Endpoint**: `GET https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lng}&method=2`
- **Date Format**: Converted from `YYYY-MM-DD` to `DD-MM-YYYY`.
- **Geolocation**: Requests `navigator.geolocation.getCurrentPosition()`. Falls back to Mecca (`21.4225, 39.8262`) if denied or unavailable.
- **Timings Extracted**: `Fajr`, `Dhuhr`, `Asr`, `Maghrib`, `Isha`.

### 2. Next Prayer Computation
- Converts API 24-hour strings (`"05:15"`) to JavaScript `Date` objects.
- Compares `now.getTime()` against prayer start times.
- If current time is past today's `Isha`, the hook fetches tomorrow's timings (`date + 1 day`) to compute the countdown to tomorrow's `Fajr`.

### 3. Countdown & Progress Percentage
- `remainingSeconds = Math.max(0, Math.floor((nextPrayerDate - now) / 1000))`
- `progressPercent`: Percentage of time elapsed between the previous prayer start time and the next prayer start time.

### 4. Notifications (`usePrayerNotifications.ts`)
- Checks `Notification.permission`.
- When `remainingSeconds <= 2`, sends `new Notification("🕌 Time for [Prayer]!")`.
- Plays a 3-note synthesizer chime using `AudioContext` (no external MP3 asset required).
- Tracks sent notifications per day to prevent duplicates.

---

## 🛠️ Verification & Build Commands

```bash
# Typecheck
npx tsc --noEmit --project apps/companion/tsconfig.json

# Next.js Production Build
yarn --cwd apps/companion build
```
