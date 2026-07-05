"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./DateRuler.module.css";

const TICK_WIDTH = 12; // px per day
const DAYS_IN_YEAR = 365;
const PADDING_DAYS = 30; // extra days of padding on each side

interface DateRulerProps {
  onDateChange: (dateStr: string) => void;
  selectedDate: string;
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDaysList(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOffset = Math.floor(DAYS_IN_YEAR / 2) + PADDING_DAYS;
  const totalDays = DAYS_IN_YEAR + PADDING_DAYS * 2;

  const days: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - startOffset + i);
    days.push(d);
  }
  return days;
}

export function DateRuler({ onDateChange, selectedDate }: DateRulerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [days] = useState<Date[]>(() => getDaysList());
  const [displayDate, setDisplayDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const isInitialScroll = useRef(true);

  // Find today's index in the days array
  const todayStr = formatDateStr(new Date());
  const todayIndex = days.findIndex((d) => formatDateStr(d) === todayStr);

  // Scroll to today on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const scrollTarget =
      todayIndex * TICK_WIDTH - containerWidth / 2 + TICK_WIDTH / 2;
    container.scrollLeft = scrollTarget;
    setMounted(true);

    // Set initial display date
    const today = new Date();
    setDisplayDate(formatDisplayDate(today));

    // Small delay before allowing scroll events to fire onDateChange
    requestAnimationFrame(() => {
      isInitialScroll.current = false;
    });
  }, [todayIndex]);

  // Handle scroll → update selected date
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isInitialScroll.current) return;
    const container = scrollRef.current;
    const centerOffset = container.scrollLeft + container.clientWidth / 2;
    const dayIndex = Math.round(centerOffset / TICK_WIDTH);
    const clampedIndex = Math.max(0, Math.min(dayIndex, days.length - 1));
    const date = days[clampedIndex];
    if (date) {
      const dateStr = formatDateStr(date);
      setDisplayDate(formatDisplayDate(date));
      if (dateStr !== selectedDate) {
        onDateChange(dateStr);
      }
    }
  }, [days, onDateChange, selectedDate]);

  // Check if a day is Friday (day 5)
  const isFriday = (date: Date) => date.getDay() === 5;
  const isToday = (date: Date) => formatDateStr(date) === todayStr;

  return (
    <div className={styles.wrapper}>
      {/* Date Display */}
      <div className={styles.dateDisplay}>
        {mounted ? displayDate : "\u00A0"}
      </div>

      {/* Ruler */}
      <div className={styles.rulerContainer}>
        {/* Center hairline */}
        <div className={styles.centerLine} />

        <div
          ref={scrollRef}
          className={styles.rulerScroll}
          onScroll={handleScroll}
        >
          <div
            className={styles.rulerTrack}
            style={{ width: `${days.length * TICK_WIDTH}px` }}
          >
            {days.map((day, i) => {
              const friday = isFriday(day);
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className={`${styles.tick} ${friday ? styles.tickFriday : ""} ${today ? styles.tickToday : ""}`}
                  style={{ left: `${i * TICK_WIDTH}px` }}
                >
                  <div
                    className={`${styles.tickLine} ${friday ? styles.tickLineFriday : ""}`}
                  />
                  {today && <div className={styles.todayDot} />}
                  {friday && (
                    <span className={styles.tickLabel}>
                      {day.getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
