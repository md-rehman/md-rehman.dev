"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import styles from "./DateRuler.module.css";

const TICK_WIDTH = 12; // px per day
const DAYS_IN_YEAR = 365;
const PADDING_DAYS = 30; // extra days of padding on each side

interface DateRulerProps {
  onDateChange: (dateStr: string) => void;
  selectedDate: string;
  startDate?: string;
  endDate?: string;
}

function parsePropDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  
  // Check if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  // Handle DD-MM-YYYY or D-MM-YYYY
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    } else if (parts[0].length === 4) {
      const year = parts[0];
      const month = parts[1].padStart(2, "0");
      const day = parts[2].padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  
  // Fallback native date parse
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return formatDateStr(d);
  }

  return dateStr;
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

export function DateRuler({
  onDateChange,
  selectedDate,
  startDate,
  endDate,
}: DateRulerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [days] = useState<Date[]>(() => getDaysList());
  const [displayDate, setDisplayDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const isInitialScroll = useRef(true);

  // Calculate valid start and end indices based on props
  const validStartIndex = useMemo(() => {
    const parsedStart = parsePropDate(startDate);
    if (!parsedStart) return 0;
    const index = days.findIndex((d) => formatDateStr(d) === parsedStart);
    return index >= 0 ? index : 0;
  }, [days, startDate]);

  const validEndIndex = useMemo(() => {
    const parsedEnd = parsePropDate(endDate);
    if (!parsedEnd) return days.length - 1;
    const index = days.findIndex((d) => formatDateStr(d) === parsedEnd);
    return index >= 0 ? index : days.length - 1;
  }, [days, endDate]);

  // Find today's index in the days array
  const todayStr = formatDateStr(new Date());
  const rawTodayIndex = days.findIndex((d) => formatDateStr(d) === todayStr);
  const todayIndex = Math.max(validStartIndex, Math.min(rawTodayIndex, validEndIndex));

  // Scroll to today on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    const scrollTarget = (todayIndex - validStartIndex) * TICK_WIDTH;
    container.scrollLeft = scrollTarget;
    setMounted(true);

    // Set initial display date
    const clampedToday = days[todayIndex];
    if (clampedToday) {
      setDisplayDate(formatDisplayDate(clampedToday));
    }

    // Small delay before allowing scroll events to fire onDateChange
    requestAnimationFrame(() => {
      isInitialScroll.current = false;
    });
  }, [todayIndex, validStartIndex, days]);

  // Handle scroll → update selected date
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isInitialScroll.current) return;
    const container = scrollRef.current;
    
    const dayIndex = Math.round(container.scrollLeft / TICK_WIDTH) + validStartIndex;
    const clampedIndex = Math.max(validStartIndex, Math.min(dayIndex, validEndIndex));
    const date = days[clampedIndex];
    
    if (date) {
      const dateStr = formatDateStr(date);
      setDisplayDate(formatDisplayDate(date));
      if (dateStr !== selectedDate) {
        onDateChange(dateStr);
      }
    }
  }, [days, onDateChange, selectedDate, validStartIndex, validEndIndex]);

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
            style={{ 
              width: `${Math.max(0, validEndIndex - validStartIndex) * TICK_WIDTH}px`,
              paddingLeft: '50%',
              paddingRight: '50%',
              boxSizing: 'content-box',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', height: '100%' }}>
              {days.map((day, i) => {
                const friday = isFriday(day);
                const today = isToday(day);
                const isDisabled = i < validStartIndex || i > validEndIndex;
                return (
                  <div
                    key={i}
                    className={`${styles.tick} ${friday ? styles.tickFriday : ""} ${today ? styles.tickToday : ""} ${isDisabled ? styles.tickDisabled : ""}`}
                    style={{ left: `calc(${(i - validStartIndex) * TICK_WIDTH}px - ${TICK_WIDTH / 2}px)` }}
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
    </div>
  );
}
