import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerStatus = "untracked" | "masjid" | "home" | "done" | "missed";

export const STATUS_CYCLE: PrayerStatus[] = [
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

export const DEBOUNCE_DELAY_MS = 3000;

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

export type DailyPrayers = Record<PrayerName, PrayerStatus>;

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

export function usePrayerTracker(selectedDate: string) {
  const { user } = useAuth();
  const [localPrayersData, setLocalPrayersData] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<Record<string, DailyPrayers>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [debounceKey, setDebounceKey] = useState<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ date: string; data: DailyPrayers } | null>(null);
  const localPrayersDataRef = useRef(localPrayersData);

  useEffect(() => {
    localPrayersDataRef.current = localPrayersData;
  }, [localPrayersData]);

  // Fetch initial data
  useEffect(() => {
    if (!user) return;
    const fetchPrayers = async () => {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error("Supabase Fetch Error:", error);
      }

      if (data && !error) {
        setLocalPrayersData(data);
      }
    };
    fetchPrayers();
  }, [user]);

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
    return { ...DEFAULT_DAY };
  }, [selectedDate, localPrayersData]);

  const prayers: DailyPrayers = useMemo(() => {
    return overrides[selectedDate] ?? baseData;
  }, [selectedDate, baseData, overrides]);

  const flushSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!pendingSaveRef.current || !user) return;

    const { date, data } = pendingSaveRef.current;
    pendingSaveRef.current = null;

    setIsSaving(true);
    setDebounceKey(0);
    try {
      const existingData = localPrayersDataRef.current.find(p => p.date === date);
      const id = existingData?.id;

      let result;
      if (id) {
        result = await supabase.from('prayers').update({
          ...data
        }).eq('id', id).select().single();
      } else {
        result = await supabase.from('prayers').insert({
          user_id: user.id,
          date,
          ...data
        }).select().single();
      }

      if (result.error) {
        console.error("Supabase Save Error:", result.error);
        throw new Error(result.error.message);
      }

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
  }, [user]);

  useEffect(() => {
    if (pendingSaveRef.current && pendingSaveRef.current.date !== selectedDate) {
      flushSave();
    }
  }, [selectedDate, flushSave]);

  useEffect(() => {
    return () => {
      if (pendingSaveRef.current) {
        flushSave();
      }
    };
  }, [flushSave]);

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
