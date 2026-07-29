import { useState, useEffect, useMemo } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerTimingItem {
  key: PrayerKey;
  name: string;
  timeStr: string; // 12-hour formatted e.g. "05:12 AM"
  rawTime: string; // 24-hour e.g. "05:12"
  date: Date;
  isNext: boolean;
  isCurrent: boolean;
}

export interface NextPrayerInfo {
  key: PrayerKey;
  name: string;
  timeStr: string;
  date: Date;
  remainingSeconds: number;
  formattedCountdown: string;
  shortCountdown: string; // e.g. "1h 24m"
  progressPercent: number; // 0 to 100 elapsed between prev and next prayer
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  locationName?: string;
}

// Default fallback coordinates (Mecca)
export const DEFAULT_LOCATION: LocationCoords = {
  latitude: 21.4225,
  longitude: 39.8262,
  locationName: "Mecca (Default)",
};

const PRAYER_KEYS: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

// Map Aladhan API timing keys to lower-case PrayerKey
const ALADHAN_MAP: Record<string, PrayerKey> = {
  Fajr: "fajr",
  Dhuhr: "dhuhr",
  Asr: "asr",
  Maghrib: "maghrib",
  Isha: "isha",
};

// In-memory static cache to avoid duplicate reads & network calls across components
let inMemoryCache: {
  dateStr: string; // YYYY-MM-DD
  rawTimings: Record<string, string>;
  tomorrowFajrRaw: string | null;
} | null = null;

function formatTodayStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function format12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padEnd(2, "0") : "00";
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${period}`;
}

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hStr}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

function formatShortCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function usePrayerTimings(selectedDateStr?: string) {
  const [coords, setCoords] = useState<LocationCoords>(DEFAULT_LOCATION);
  const [rawTimings, setRawTimings] = useState<Record<string, string> | null>(
    inMemoryCache?.rawTimings ?? null
  );
  const [tomorrowFajrRaw, setTomorrowFajrRaw] = useState<string | null>(
    inMemoryCache?.tomorrowFajrRaw ?? null
  );
  const [loading, setLoading] = useState<boolean>(!inMemoryCache);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const [locationPermission, setLocationPermission] = useState<"idle" | "granted" | "denied">("idle");

  const todayStr = useMemo(() => formatTodayStr(now), [now]);

  // Geolocation request via expo-location (only once on mount)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (Location && typeof Location.requestForegroundPermissionsAsync === "function") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            if (isMounted) {
              setCoords({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                locationName: "Current Location",
              });
              setLocationPermission("granted");
            }
          } else {
            if (isMounted) setLocationPermission("denied");
          }
        } else {
          if (isMounted) setLocationPermission("denied");
        }
      } catch (err) {
        console.warn("Expo location permission error, using default Mecca location:", err);
        if (isMounted) setLocationPermission("denied");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch or Load Timings for Current Date (Max 1 API Call Per Day)
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `@prayer_timings_v1_${todayStr}`;

    async function loadTimings() {
      // 1. Check in-memory cache first
      if (inMemoryCache && inMemoryCache.dateStr === todayStr) {
        if (isMounted) {
          setRawTimings(inMemoryCache.rawTimings);
          setTomorrowFajrRaw(inMemoryCache.tomorrowFajrRaw);
          setLoading(false);
        }
        return;
      }

      // 2. Check AsyncStorage cache
      try {
        const stored = await AsyncStorage.getItem(cacheKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.rawTimings) {
            inMemoryCache = {
              dateStr: todayStr,
              rawTimings: parsed.rawTimings,
              tomorrowFajrRaw: parsed.tomorrowFajrRaw ?? null,
            };
            if (isMounted) {
              setRawTimings(parsed.rawTimings);
              setTomorrowFajrRaw(parsed.tomorrowFajrRaw ?? null);
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        console.warn("AsyncStorage read error:", err);
      }

      // 3. Always use CURRENT DATE (DD-MM-YYYY) for Aladhan API endpoint
      try {
        if (isMounted) setLoading(true);
        const currentDate = new Date();
        const d = String(currentDate.getDate()).padStart(2, "0");
        const m = String(currentDate.getMonth() + 1).padStart(2, "0");
        const y = currentDate.getFullYear();
        const currentDateForApi = `${d}-${m}-${y}`;

        const url = `https://api.aladhan.com/v1/timings/${currentDateForApi}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Aladhan API HTTP ${res.status}`);
        const data = await res.json();

        let tFajrRaw: string | null = null;
        try {
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tD = String(tomorrow.getDate()).padStart(2, "0");
          const tM = String(tomorrow.getMonth() + 1).padStart(2, "0");
          const tY = tomorrow.getFullYear();
          const tomUrl = `https://api.aladhan.com/v1/timings/${tD}-${tM}-${tY}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2`;
          const tomRes = await fetch(tomUrl);
          const tomData = await tomRes.json();
          if (tomData?.data?.timings?.Fajr) {
            tFajrRaw = tomData.data.timings.Fajr.split(" ")[0];
          }
        } catch {
          // silent fallback
        }

        if (data && data.data && data.data.timings) {
          const fetchedTimings = data.data.timings;
          inMemoryCache = {
            dateStr: todayStr,
            rawTimings: fetchedTimings,
            tomorrowFajrRaw: tFajrRaw,
          };
          await AsyncStorage.setItem(
            cacheKey,
            JSON.stringify({ rawTimings: fetchedTimings, tomorrowFajrRaw: tFajrRaw })
          );
          if (isMounted) {
            setRawTimings(fetchedTimings);
            setTomorrowFajrRaw(tFajrRaw);
            setError(null);
          }
        } else {
          if (isMounted) setError("Invalid timing data format");
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch prayer timings");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTimings();

    return () => {
      isMounted = false;
    };
  }, [todayStr, coords]);

  // Live timer tick every 1 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Parse raw timings into Date objects & structured list
  const { timingsList, timingsMap, nextPrayer, currentPrayerKey } = useMemo(() => {
    if (!rawTimings) {
      return {
        timingsList: [],
        timingsMap: {} as Record<PrayerKey, string>,
        nextPrayer: null as NextPrayerInfo | null,
        currentPrayerKey: null as PrayerKey | null,
      };
    }

    // Base date for live countdown calculation is ALWAYS current date (today)
    const baseDate = new Date();
    const cleanTimings: Record<PrayerKey, { raw: string; date: Date }> = {} as any;

    for (const [key, prayerKey] of Object.entries(ALADHAN_MAP)) {
      const rawVal = (rawTimings[key] || "00:00").split(" ")[0];
      const [h, m] = rawVal.split(":").map(Number);
      const pDate = new Date(baseDate);
      pDate.setHours(h, m, 0, 0);
      cleanTimings[prayerKey] = { raw: rawVal, date: pDate };
    }

    const nowTime = now.getTime();

    // Determine upcoming prayer
    let upcomingKey: PrayerKey | null = null;
    let upcomingDate: Date | null = null;
    let prevDate: Date | null = null;
    let currKey: PrayerKey | null = null;

    for (let i = 0; i < PRAYER_KEYS.length; i++) {
      const key = PRAYER_KEYS[i];
      const pDate = cleanTimings[key].date;
      if (pDate.getTime() > nowTime) {
        upcomingKey = key;
        upcomingDate = pDate;
        if (i > 0) {
          prevDate = cleanTimings[PRAYER_KEYS[i - 1]].date;
          currKey = PRAYER_KEYS[i - 1];
        } else {
          // Before Fajr today → previous prayer was yesterday's Isha
          const yesterdayIsha = new Date(cleanTimings.isha.date);
          yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
          prevDate = yesterdayIsha;
          currKey = "isha";
        }
        break;
      }
    }

    // If no upcoming prayer today, next prayer is tomorrow's Fajr
    if (!upcomingKey) {
      upcomingKey = "fajr";
      currKey = "isha";
      prevDate = cleanTimings.isha.date;
      const tFajrRaw = tomorrowFajrRaw || cleanTimings.fajr.raw;
      const [fh, fm] = tFajrRaw.split(":").map(Number);
      const tomFajrDate = new Date(baseDate);
      tomFajrDate.setDate(tomFajrDate.getDate() + 1);
      tomFajrDate.setHours(fh, fm, 0, 0);
      upcomingDate = tomFajrDate;
    }

    const diffSec = upcomingDate ? Math.max(0, Math.floor((upcomingDate.getTime() - nowTime) / 1000)) : 0;

    let progressPercent = 0;
    if (prevDate && upcomingDate) {
      const totalInterval = upcomingDate.getTime() - prevDate.getTime();
      const elapsed = nowTime - prevDate.getTime();
      progressPercent = Math.min(100, Math.max(0, (elapsed / totalInterval) * 100));
    }

    const nextInfo: NextPrayerInfo | null = upcomingKey && upcomingDate ? {
      key: upcomingKey,
      name: PRAYER_LABELS[upcomingKey],
      timeStr: format12Hour(upcomingKey === "fajr" && upcomingDate > cleanTimings.fajr.date ? (tomorrowFajrRaw || cleanTimings.fajr.raw) : cleanTimings[upcomingKey].raw),
      date: upcomingDate,
      remainingSeconds: diffSec,
      formattedCountdown: formatCountdown(diffSec),
      shortCountdown: formatShortCountdown(diffSec),
      progressPercent: Math.round(progressPercent),
    } : null;

    const list: PrayerTimingItem[] = PRAYER_KEYS.map((key) => {
      const item = cleanTimings[key];
      return {
        key,
        name: PRAYER_LABELS[key],
        timeStr: format12Hour(item.raw),
        rawTime: item.raw,
        date: item.date,
        isNext: key === upcomingKey,
        isCurrent: key === currKey,
      };
    });

    const map: Record<PrayerKey, string> = {} as any;
    for (const key of PRAYER_KEYS) {
      map[key] = format12Hour(cleanTimings[key].raw);
    }

    return {
      timingsList: list,
      timingsMap: map,
      nextPrayer: nextInfo,
      currentPrayerKey: currKey,
    };
  }, [rawTimings, now, tomorrowFajrRaw]);

  return {
    loading,
    error,
    timingsList,
    timingsMap,
    nextPrayer,
    currentPrayerKey,
    coords,
    locationPermission,
  };
}
