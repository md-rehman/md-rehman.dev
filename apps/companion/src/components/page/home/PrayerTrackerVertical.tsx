"use client";

import {
  usePrayerTracker,
  PRAYER_NAMES,
  STATUS_META,
  type PrayerName,
} from "@/hooks/usePrayerTracker";
import styles from "./PrayerTrackerVertical.module.css";

const PRAYER_DISPLAY: Record<PrayerName, { name: string; time: string }> = {
  fajr: { name: "Fajr", time: "Dawn" },
  dhuhr: { name: "Dhuhr", time: "Midday" },
  asr: { name: "Asr", time: "Afternoon" },
  maghrib: { name: "Maghrib", time: "Sunset" },
  isha: { name: "Isha", time: "Night" },
};

interface PrayerTrackerVerticalProps {
  selectedDate: string;
}

export function PrayerTrackerVertical({
  selectedDate,
}: PrayerTrackerVerticalProps) {
  const { prayers, cycleStatus, score } = usePrayerTracker(selectedDate);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.score}>
          {score.completed}/{score.total}
        </span>
        <span className={styles.scoreLabel}>prayers completed</span>
      </div>

      <div className={styles.cardList}>
        {PRAYER_NAMES.map((name) => {
          const status = prayers[name];
          const meta = STATUS_META[status];
          const display = PRAYER_DISPLAY[name];
          return (
            <button
              key={name}
              className={styles.card}
              onClick={() => cycleStatus(name)}
              style={
                {
                  "--card-accent": meta.color,
                } as React.CSSProperties
              }
            >
              <div className={styles.cardLeft}>
                <span className={styles.prayerName}>{display.name}</span>
                <span className={styles.prayerTime}>{display.time}</span>
              </div>
              <div className={styles.cardRight}>
                <span className={styles.statusIcon}>{meta.icon}</span>
                <span
                  className={styles.statusLabel}
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
