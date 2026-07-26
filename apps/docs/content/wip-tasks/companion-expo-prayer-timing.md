---
title: "Companion Expo: Prayer Timing Feature"
description: "Implementation specification and mobile guide for Aladhan API integration, countdown timer, and local notifications in companion-expo"
category: "wip-tasks"
order: 2
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-26"
---

# Companion Expo — Prayer Timing Feature Guide 📱⚡

This document details the specification, architecture, and step-by-step implementation guide for building the **Prayer Timing Feature** in `apps/companion-expo` (React Native / Expo). AI agents and developers working on `companion-expo` should use this document for context and cross-platform alignment with `companion` web.

---

## 🎯 Mobile Feature Requirements

1. **Aladhan API & Device Location**: Fetch daily prayer times using `expo-location` (with Mecca fallback).
2. **React Native Countdown Timer Widget**: Display a hero card with Next Prayer title, live countdown timer (`HH:MM:SS`), start time, and progress bar.
3. **Local Expo Notifications (`expo-notifications`)**: Request permissions and schedule local alerts when a prayer time starts.
4. **Mobile Prayer Tracker Alignment**: Update existing `PrayerTrackerRadial` and date ruler to sync with prayer timings.

---

## 🏗️ Technical Architecture & Modules

### Required Expo Modules

Ensure the following packages are configured in `apps/companion-expo/package.json`:
- `expo-location`: Device GPS coordinates for accurate local prayer calculation.
- `expo-notifications`: Scheduling and triggering local push alerts on iOS and Android.

---

## 📡 API Specification & Location Fallback

- **API URL**: `GET https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lng}&method=2`
- **Date Format**: `DD-MM-YYYY` (e.g. `26-07-2026`).
- **Location Logic**:
  ```typescript
  import * as Location from "expo-location";

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === "granted") {
    const loc = await Location.getCurrentPositionAsync({});
    // use loc.coords.latitude, loc.coords.longitude
  } else {
    // Fallback: Mecca (lat: 21.4225, lng: 39.8262)
  }
  ```

---

## 🧠 Business Logic Implementation Guide

### 1. Parsing & 12-Hour Conversion
- Parse Aladhan API timings (`Fajr`, `Dhuhr`, `Asr`, `Maghrib`, `Isha`).
- Format times into 12-hour strings (e.g., `"05:15" -> "05:15 AM"`).

### 2. Next Prayer & Wrap-around
- Compare current local time against prayer start times.
- If current time > today's `Isha`, fetch tomorrow's `Fajr` timing to calculate remaining countdown seconds.

### 3. Countdown & Progress Percentage
- `remainingSeconds = Math.max(0, Math.floor((nextPrayerDate.getTime() - Date.now()) / 1000))`
- Progress percentage: Elapsed interval between previous prayer time and next prayer time.

---

## 🔔 Mobile Notifications Setup (`expo-notifications`)

```typescript
import * as Notifications from "expo-notifications";

// 1. Request permission
const { status } = await Notifications.requestPermissionsAsync();

// 2. Schedule alert when prayer starts
await Notifications.scheduleNotificationAsync({
  content: {
    title: `🕌 Time for ${prayerName}!`,
    body: `It is now time for ${prayerName} prayer (${timeStr}).`,
    sound: true,
  },
  trigger: { date: prayerDate },
});
```

---

## 🎨 UI Component Structure

### `NextPrayerTimer` Component (`components/NextPrayerTimer.tsx`)
- **Header**: `View` with location indicator badge & notification alert toggle switch.
- **Hero Card**:
  - Emoji & Prayer Name (`🌅 Fajr`, `☀️ Dhuhr`, `🌤️ Asr`, `hb Maghrib`, `🌙 Isha`).
  - Monospace Countdown text (`01:24:15`).
  - Styled `View` progress bar with `width: `${progressPercent}%``.
- **Timings Row**: Horizontal ScrollView or Flex row displaying 5 prayer timing pills with active next prayer highlighting.

---

## 🛠️ Build & Execution Commands for Mobile

```bash
# Start local Metro bundler
yarn start

# Run directly on iOS physical device
yarn ios --device

# Run EAS Preview Cloud Build
npx eas-cli build --platform ios --profile preview
```
