"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NextPrayerInfo } from "./usePrayerTimings";

const STORAGE_KEY = "prayer_notifications_enabled";

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pleasant chime chord / note sequence
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn("Audio chime playback error:", e);
  }
}

export function usePrayerNotifications(nextPrayer: NextPrayerInfo | null) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const notifiedSetRef = useRef<Set<string>>(new Set());

  // Load saved preference & permission status
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setEnabled(saved === "true" && Notification.permission === "granted");
      }
    }
  }, []);

  const requestAndEnable = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser notifications are not supported in this browser.");
      return false;
    }

    let currentPerm = Notification.permission;
    if (currentPerm === "default") {
      currentPerm = await Notification.requestPermission();
      setPermission(currentPerm);
    }

    if (currentPerm === "granted") {
      const nextState = !enabled;
      setEnabled(nextState);
      localStorage.setItem(STORAGE_KEY, String(nextState));

      if (nextState) {
        // Send a test notification
        new Notification("🕌 Prayer Alerts Enabled", {
          body: "You will be notified when each prayer time starts.",
          icon: "/favicon.ico",
        });
        playNotificationChime();
      }
      return nextState;
    } else {
      alert("Notification permissions were denied in your browser settings.");
      setEnabled(false);
      localStorage.setItem(STORAGE_KEY, "false");
      return false;
    }
  }, [enabled]);

  // Monitor next prayer time for notification trigger
  useEffect(() => {
    if (!enabled || !nextPrayer || permission !== "granted") return;

    // Unique key for this prayer event today
    const dateStr = nextPrayer.date.toISOString().split("T")[0];
    const eventKey = `${dateStr}_${nextPrayer.key}`;

    // If remainingSeconds is <= 2 and we haven't notified for this prayer event yet
    if (nextPrayer.remainingSeconds <= 2 && !notifiedSetRef.current.has(eventKey)) {
      notifiedSetRef.current.add(eventKey);

      try {
        new Notification(`🕌 Time for ${nextPrayer.name}!`, {
          body: `It is now time for ${nextPrayer.name} prayer (${nextPrayer.timeStr}).`,
          icon: "/favicon.ico",
          tag: eventKey,
          requireInteraction: true,
        });
        playNotificationChime();
      } catch (err) {
        console.error("Error triggering notification:", err);
      }
    }
  }, [nextPrayer, enabled, permission]);

  return {
    enabled,
    permission,
    toggleNotifications: requestAndEnable,
  };
}
