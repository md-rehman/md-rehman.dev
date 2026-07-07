"use client";

import { useState, useCallback, useMemo } from "react";
import { prayer_strict_group_by_date } from "@/constants/mock_prayers_strict";

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerStatus = "untracked" | "masjid" | "home" | "done" | "missed";

const STATUS_CYCLE: PrayerStatus[] = [
  "untracked",
  "masjid",
  "home",
  "done",
  "missed",
];

export const PRAYER_NAMES: PrayerName[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export const STATUS_META: Record<
  PrayerStatus,
  { icon: string; label: string; color: string }
> = {
  untracked: { icon: "⬜", label: "Untracked", color: "#555566" },
  masjid: { icon: "🕌", label: "Masjid", color: "#00e5a0" },
  home: { icon: "🏠", label: "Home", color: "#ffb347" },
  done: { icon: "✅", label: "Done", color: "#4cdf50" },
  missed: { icon: "❌", label: "Missed", color: "#ff5252" },
};

type DailyPrayers = Record<PrayerName, PrayerStatus>;

// Normalize the mock data status strings (e.g. "untracker" → "untracked")
function normalizeStatus(raw: string): PrayerStatus {
  if (raw === "untracker") return "untracked";
  if (STATUS_CYCLE.includes(raw as PrayerStatus)) return raw as PrayerStatus;
  return "untracked";
}

const DEFAULT_DAY: DailyPrayers = {
  fajr: "untracked",
  dhuhr: "untracked",
  asr: "untracked",
  maghrib: "untracked",
  isha: "untracked",
};

export function usePrayerTracker(selectedDate: string, initialPrayersData?: any[]) {
  // Local overrides: keyed by "YYYY-MM-DD", stores the full DailyPrayers
  const [overrides, setOverrides] = useState<Record<string, DailyPrayers>>({});

  // Get the base data for the selected date from supabase data or fallback to mock data
  const baseData = useMemo((): DailyPrayers => {
    if (initialPrayersData) {
      const dayData = initialPrayersData.find((p: any) => p.date === selectedDate);
      if (dayData) {
        return {
          fajr: normalizeStatus(dayData.fajr ?? "untracked"),
          dhuhr: normalizeStatus(dayData.dhuhr ?? "untracked"),
          asr: normalizeStatus(dayData.asr ?? "untracked"),
          maghrib: normalizeStatus(dayData.maghrib ?? "untracked"),
          isha: normalizeStatus(dayData.isha ?? "untracked"),
        };
      }
    }

    const raw = (
      prayer_strict_group_by_date as Record<
        string,
        Record<string, string>
      >
    )[selectedDate];
    if (!raw) return { ...DEFAULT_DAY };
    return {
      fajr: normalizeStatus(raw.fajr ?? "untracked"),
      dhuhr: normalizeStatus(raw.dhuhr ?? "untracked"),
      asr: normalizeStatus(raw.asr ?? "untracked"),
      maghrib: normalizeStatus(raw.maghrib ?? "untracked"),
      isha: normalizeStatus(raw.isha ?? "untracked"),
    };
  }, [selectedDate, initialPrayersData]);

  // Merge overrides on top of base data
  const prayers: DailyPrayers = useMemo(() => {
    return overrides[selectedDate] ?? baseData;
  }, [selectedDate, baseData, overrides]);

  // Cycle a prayer's status
  const cycleStatus = useCallback(
    (prayer: PrayerName) => {
      setOverrides((prev) => {
        const current = prev[selectedDate] ?? baseData;
        const currentStatus = current[prayer];
        const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
        const nextStatus =
          STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
        return {
          ...prev,
          [selectedDate]: {
            ...current,
            [prayer]: nextStatus,
          },
        };
      });
    },
    [selectedDate, baseData]
  );

  // Calculate score for the day (count of non-untracked, non-missed)
  const score = useMemo(() => {
    let completed = 0;
    for (const name of PRAYER_NAMES) {
      const status = prayers[name];
      if (status === "masjid" || status === "home" || status === "done") {
        completed++;
      }
    }
    return { completed, total: 5 };
  }, [prayers]);

  return { prayers, cycleStatus, score };
}
