"use client";

import React from "react";
import { usePrayerTimings, PrayerKey } from "@/hooks/usePrayerTimings";
import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import styles from "../NextPrayerTimer.module.css";

const PRAYER_EMOJIS: Record<PrayerKey, string> = {
  fajr: "🌅",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌇",
  isha: "🌙",
};

export function PrayerBody() {
  const { loading, error, timingsList, nextPrayer, coords } = usePrayerTimings();
  const { enabled: notifEnabled, toggleNotifications } = usePrayerNotifications(nextPrayer);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#ff5252" }}>
        ⚠️ Could not load prayer timings: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.locationBadge} title={`Lat: ${coords.latitude.toFixed(2)}, Lng: ${coords.longitude.toFixed(2)}`}>
          <span>📍</span>
          <span>{coords.locationName || "Mecca (Default)"}</span>
        </div>

        <button
          className={`${styles.notifButton} ${notifEnabled ? styles.notifActive : ""}`}
          onClick={toggleNotifications}
          title={notifEnabled ? "Notifications active" : "Enable prayer alerts"}
        >
          <span>{notifEnabled ? "🔔" : "🔕"}</span>
          <span>{notifEnabled ? "Alerts On" : "Enable Alerts"}</span>
        </button>
      </div>

      {/* Hero Timer Display */}
      {nextPrayer ? (
        <div className={styles.hero}>
          <div className={styles.nextLabelRow}>
            <span>Upcoming Prayer</span>
          </div>

          <div className={styles.prayerTitle}>
            <span>{PRAYER_EMOJIS[nextPrayer.key]}</span>
            <span>{nextPrayer.name}</span>
          </div>

          <div className={styles.timerDisplay}>
            {nextPrayer.formattedCountdown}
          </div>

          <div className={styles.startTimeText}>
            Starts today at <strong>{nextPrayer.timeStr}</strong>
          </div>

          {/* Progress bar */}
          <div className={styles.progressTrack} title={`${nextPrayer.progressPercent}% elapsed`}>
            <div
              className={styles.progressBar}
              style={{ width: `${nextPrayer.progressPercent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.hero}>
          <div className={styles.prayerTitle}>All Prayers Complete Today</div>
        </div>
      )}

      {/* Timings Pills Bar */}
      <div className={styles.timingsGrid}>
        {timingsList.map((item) => {
          const isNext = item.isNext;
          const isCurrent = item.isCurrent;

          let cellClass = styles.timingCell;
          if (isNext) cellClass += ` ${styles.timingCellNext}`;
          else if (isCurrent) cellClass += ` ${styles.timingCellCurrent}`;

          return (
            <div
              key={item.key}
              className={cellClass}
              title={`${item.name}: ${item.timeStr}`}
            >
              <span className={styles.cellName}>
                {PRAYER_EMOJIS[item.key]} {item.name}
              </span>
              <span className={styles.cellTime}>{item.timeStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
