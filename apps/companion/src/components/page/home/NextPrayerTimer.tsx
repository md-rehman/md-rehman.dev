"use client";

import React from "react";
import { usePrayerTimings, PrayerKey } from "@/hooks/usePrayerTimings";
import styles from "./NextPrayerTimer.module.css";

const PRAYER_EMOJIS: Record<PrayerKey, string> = {
  fajr: "🌅",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌇",
  isha: "🌙",
};

interface NextPrayerTimerProps {
  selectedDate?: string;
  onOpenPrayersApp?: () => void;
}

export function NextPrayerTimer({ selectedDate, onOpenPrayersApp }: NextPrayerTimerProps) {
  const { loading, error, nextPrayer } = usePrayerTimings(selectedDate);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className={styles.compactPill} disabled>
          <div className={styles.loadingSpinner} style={{ width: 14, height: 14, margin: 0 }} />
          <span>Loading timings...</span>
        </button>
      </div>
    );
  }

  if (error || !nextPrayer) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className={styles.compactPill} onClick={onOpenPrayersApp}>
          <span>🕌</span>
          <span>Prayers Complete</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        className={styles.compactPill}
        onClick={onOpenPrayersApp}
        title="Click to open Prayers App details"
      >
        <span>{PRAYER_EMOJIS[nextPrayer.key]}</span>
        <span>
          {nextPrayer.name} in <span className={styles.compactHighlight}>{nextPrayer.shortCountdown}</span>
        </span>
      </button>
    </div>
  );
}
