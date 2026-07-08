"use client";

import {
  usePrayerTracker,
  PRAYER_NAMES,
  STATUS_META,
  type PrayerName,
} from "@/hooks/usePrayerTracker";
import styles from "./PrayerTrackerHorizontal.module.css";

const PRAYER_DISPLAY: Record<PrayerName, { name: string; short: string }> = {
  fajr: { name: "Fajr", short: "FJR" },
  dhuhr: { name: "Dhuhr", short: "DHR" },
  asr: { name: "Asr", short: "ASR" },
  maghrib: { name: "Maghrib", short: "MGH" },
  isha: { name: "Isha", short: "ISH" },
};

interface PrayerTrackerHorizontalProps {
  selectedDate: string;
}

export function PrayerTrackerHorizontal({
  selectedDate,
}: PrayerTrackerHorizontalProps) {
  const { prayers, cycleStatus, score } = usePrayerTracker(selectedDate);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBar}>
        <span className={styles.scoreNum}>{score.completed}</span>
        <span className={styles.scoreSep}>/</span>
        <span className={styles.scoreTotal}>{score.total}</span>
      </div>

      <div className={styles.tileRow}>
        {PRAYER_NAMES.map((name) => {
          const status = prayers[name];
          const meta = STATUS_META[status];
          const display = PRAYER_DISPLAY[name];
          return (
            <button
              key={name}
              className={styles.tile}
              onClick={() => cycleStatus(name)}
              style={
                {
                  "--tile-color": meta.color,
                } as React.CSSProperties
              }
              title={`${display.name}: ${meta.label}`}
            >
              <span className={styles.tileIcon}>{meta.icon}</span>
              <span className={styles.tileName}>{display.short}</span>
              <span
                className={styles.tileStatus}
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
