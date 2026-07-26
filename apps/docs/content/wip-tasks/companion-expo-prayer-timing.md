---
title: "Companion Expo: Prayer Timing Feature"
description: "Implementation specification and mobile guide for Aladhan API integration, caching, countdown timer, and local notifications in companion-expo"
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
2. **Single Daily Call Caching**: Cache Aladhan API responses in `AsyncStorage` and in-memory cache so the network request runs **at most once per day** (not on date changes or re-renders).
3. **Compact Timer Pill & ActionSheet**: Display inline `<Prayer Name> in <Time Left>` pill on Home screen. Pressing opens a native bottom ActionSheet modal.
4. **Local Expo Notifications (`expo-notifications`)**: Request permissions and schedule local alerts when a prayer time starts.

---

## 🏗️ Technical Architecture & Persistence Caching

### API Request & Persistence Strategy
- **Cache Key**: `@prayer_timings_v1_{YYYY-MM-DD}` via `@react-native-async-storage/async-storage`.
- **In-Memory Cache**: Prevents duplicate reads and API hits on app re-renders.
- **Date Changes**: Changing the selected date on the Home screen does NOT re-trigger Aladhan API network calls. Timings are calculated against the cached daily data and live local clock.

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check memory cache -> Check AsyncStorage -> Fetch API once per day if missing
```

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
- If current time > today's `Isha`, fetch/use tomorrow's `Fajr` timing to calculate remaining countdown seconds.

### 3. Countdown & Progress Percentage
- `remainingSeconds = Math.max(0, Math.floor((nextPrayerDate.getTime() - Date.now()) / 1000))`
- `shortCountdown`: Formatted as `1h 24m` or `24m 15s`.
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

## 🛠️ Build & Execution Commands for Mobile

```bash
# Start local Metro bundler
yarn start

# Run directly on iOS physical device
yarn ios --device

# Run EAS Preview Cloud Build
npx eas-cli build --platform ios --profile preview
```
