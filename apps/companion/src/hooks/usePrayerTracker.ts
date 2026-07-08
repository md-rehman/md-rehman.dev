"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { prayer_strict_group_by_date } from "@/constants/mock_prayers_strict";
import { saveDayPrayers } from "@/app/actions";

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

export const DEBOUNCE_DELAY_MS = 10000;

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

export function usePrayerTracker(
  selectedDate: string,
  initialPrayersData?: any[],
  onPrayersUpdate?: (data: any[]) => void
) {
  // We keep a local copy of the fetched data to update it without needing a full page refetch
  const [localPrayersData, setLocalPrayersData] = useState<any[]>(initialPrayersData || []);

  // Sync with initial data if it changes from the server
  useEffect(() => {
    if (initialPrayersData) {
      setLocalPrayersData(initialPrayersData);
    }
  }, [initialPrayersData]);

  const localPrayersDataRef = useRef(localPrayersData);
  useEffect(() => {
    localPrayersDataRef.current = localPrayersData;
  }, [localPrayersData]);

  // Local overrides: keyed by "YYYY-MM-DD", stores the full DailyPrayers
  const [overrides, setOverrides] = useState<Record<string, DailyPrayers>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [debounceKey, setDebounceKey] = useState<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ date: string; data: DailyPrayers } | null>(null);

  // Get the base data for the selected date from supabase data or fallback to mock data
  const baseData = useMemo((): DailyPrayers => {
    const dayData = localPrayersData.find((p: any) => p.date === selectedDate);
    if (dayData) {
      return {
        fajr: normalizeStatus(dayData.fajr ?? "untracked"),
        dhuhr: normalizeStatus(dayData.dhuhr ?? "untracked"),
        asr: normalizeStatus(dayData.asr ?? "untracked"),
        maghrib: normalizeStatus(dayData.maghrib ?? "untracked"),
        isha: normalizeStatus(dayData.isha ?? "untracked"),
      };
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
  }, [selectedDate, localPrayersData]);

  // Merge overrides on top of base data
  const prayers: DailyPrayers = useMemo(() => {
    return overrides[selectedDate] ?? baseData;
  }, [selectedDate, baseData, overrides]);

  const flushSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!pendingSaveRef.current) return;

    const { date, data } = pendingSaveRef.current;
    pendingSaveRef.current = null;

    setIsSaving(true);
    setDebounceKey(0);
    try {
      const existingData = localPrayersDataRef.current.find(p => p.date === date);
      const id = existingData?.id;

      const result = await saveDayPrayers({
        date,
        prayers: {
          fajr: data.fajr,
          dhuhr: data.dhuhr,
          asr: data.asr,
          maghrib: data.maghrib,
          isha: data.isha,
        },
        id,
      });

      if (result.data) {
        const prev = localPrayersDataRef.current;
        const index = prev.findIndex((p) => p.date === date);
        let newArr;
        if (index !== -1) {
          newArr = [...prev];
          newArr[index] = result.data;
        } else {
          newArr = [...prev, result.data];
        }

        setLocalPrayersData(newArr);
        if (onPrayersUpdate) onPrayersUpdate(newArr);

        // Clear the override for this date since it's now synced with local data
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[date];
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to save prayers:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Flush pending save immediately if we switch dates
  useEffect(() => {
    if (pendingSaveRef.current && pendingSaveRef.current.date !== selectedDate) {
      flushSave();
    }
  }, [selectedDate, flushSave]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (pendingSaveRef.current) {
        flushSave();
      }
    };
  }, [flushSave]);

  // Cycle a prayer's status
  const cycleStatus = useCallback(
    (prayer: PrayerName) => {
      setOverrides((prev) => {
        const current = prev[selectedDate] ?? baseData;
        const currentStatus = current[prayer];
        const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
        const nextStatus =
          STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

        const newData = {
          ...current,
          [prayer]: nextStatus,
        };

        pendingSaveRef.current = { date: selectedDate, data: newData };
        setDebounceKey(Date.now());

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          flushSave();
        }, DEBOUNCE_DELAY_MS);

        return {
          ...prev,
          [selectedDate]: newData,
        };
      });
    },
    [selectedDate, baseData, flushSave]
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

  return { prayers, cycleStatus, score, isSaving, debounceKey };
}
