"use client";

import {
  usePrayerTracker,
  PRAYER_NAMES,
  STATUS_META,
  DEBOUNCE_DELAY_MS,
  type PrayerName,
} from "@/hooks/usePrayerTracker";
import styles from "./PrayerTrackerRadial.module.css";

const PRAYER_DISPLAY: Record<PrayerName, { name: string; emoji: string }> = {
  fajr: { name: "Fajr", emoji: "🌅" },
  dhuhr: { name: "Dhuhr", emoji: "☀️" },
  asr: { name: "Asr", emoji: "🌤️" },
  maghrib: { name: "Maghrib", emoji: "🌇" },
  isha: { name: "Isha", emoji: "🌙" },
};

interface PrayerTrackerRadialProps {
  selectedDate: string;
  prayersData?: any[];
  onPrayersUpdate?: (data: any[]) => void;
}

export function PrayerTrackerRadial({
  selectedDate,
  prayersData,
  onPrayersUpdate,
}: PrayerTrackerRadialProps) {
  const { prayers, cycleStatus, score, isSaving, debounceKey } = usePrayerTracker(
    selectedDate,
    prayersData,
    onPrayersUpdate
  );

  // Position 5 nodes evenly around a circle, starting from the top
  const radius = 120; // px from center
  const nodePositions = PRAYER_NAMES.map((_, i) => {
    const angle = (i * 360) / 5 - 90; // Start from top (-90°)
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    };
  });

  // Calculate ring progress
  const progressPercent = (score.completed / score.total) * 100;
  const circumference = 2 * Math.PI * 90; // ring radius = 90
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className={styles.container}>
      {/* Background ring SVG */}
      <svg
        className={styles.ringSvg}
        viewBox="0 0 240 240"
        fill="none"
      >
        {/* Track ring */}
        <circle
          cx="120"
          cy="120"
          r="90"
          stroke="var(--card-border)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx="120"
          cy="120"
          r="90"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={styles.progressRing}
          transform="rotate(-90 120 120)"
        />
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="50%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent-1)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center score badge or loading spinner */}
      <div className={styles.centerBadge}>
        {isSaving ? (
          <div className={styles.spinner} title="Saving..."></div>
        ) : (
          <>
            {debounceKey !== 0 && (
              <svg className={styles.timerSvg} viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="34"
                  className={styles.timerRing}
                  key={debounceKey}
                  stroke="url(#progressGradient)"
                  style={{ animationDuration: `${DEBOUNCE_DELAY_MS}ms` } as React.CSSProperties}
                />
              </svg>
            )}
            <span className={styles.scoreNum}>{score.completed}</span>
            <span className={styles.scoreDivider}>/</span>
            <span className={styles.scoreTotal}>{score.total}</span>
          </>
        )}
      </div>

      {/* Prayer nodes */}
      {PRAYER_NAMES.map((name, i) => {
        const pos = nodePositions[i];
        const status = prayers[name];
        const meta = STATUS_META[status];
        const display = PRAYER_DISPLAY[name];
        return (
          <button
            key={name}
            className={styles.node}
            onClick={() => cycleStatus(name)}
            disabled={isSaving}
            style={
              {
                "--node-x": `${pos.x}px`,
                "--node-y": `${pos.y}px`,
                "--node-color": meta.color,
              } as React.CSSProperties
            }
            title={`${display.name}: ${meta.label}`}
          >
            <span className={styles.nodeIcon}>{meta.icon}</span>
            <span className={styles.nodeName}>{display.name}</span>
          </button>
        );
      })}
    </div>
  );
}
