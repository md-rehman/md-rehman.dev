import { useState, useEffect, useCallback, useRef } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NextPrayerInfo } from "./usePrayerTimings";

const STORAGE_KEY = "prayer_notifications_enabled";

// Safe initialization helper for Notification Handler
function safeSetNotificationHandler() {
  try {
    if (Notifications && typeof Notifications.setNotificationHandler === "function") {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
          priority: Notifications.AndroidNotificationPriority?.HIGH ?? 4,
        }),
      });
    }
  } catch (err) {
    console.warn("ExpoNotifications native module not available:", err);
  }
}

export function usePrayerNotifications(nextPrayer: NextPrayerInfo | null) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const notifiedSetRef = useRef<Set<string>>(new Set());

  // Set notification handler safely on mount
  useEffect(() => {
    safeSetNotificationHandler();
  }, []);

  // Load saved notification preference & permission status
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (Notifications && typeof Notifications.getPermissionsAsync === "function") {
          const { status } = await Notifications.getPermissionsAsync();
          const isGranted = status === "granted";
          if (isMounted) setPermissionGranted(isGranted);

          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved !== null && isMounted) {
            setEnabled(saved === "true" && isGranted);
          }
        }
      } catch (err) {
        console.warn("Notification permission check failed or native module unavailable:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleNotifications = useCallback(async () => {
    try {
      if (!Notifications || typeof Notifications.getPermissionsAsync !== "function") {
        console.warn("Notifications native module not available.");
        return false;
      }
      let currentPerm = await Notifications.getPermissionsAsync();
      let isGranted = currentPerm.status === "granted";

      if (!isGranted) {
        const req = await Notifications.requestPermissionsAsync();
        isGranted = req.status === "granted";
        setPermissionGranted(isGranted);
      }

      if (isGranted) {
        const nextState = !enabled;
        setEnabled(nextState);
        await AsyncStorage.setItem(STORAGE_KEY, String(nextState));

        if (nextState) {
          // Trigger confirmation notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🕌 Prayer Alerts Enabled",
              body: "You will be notified when each prayer time starts.",
              sound: true,
            },
            trigger: null,
          });
        }
        return nextState;
      } else {
        setEnabled(false);
        await AsyncStorage.setItem(STORAGE_KEY, "false");
        return false;
      }
    } catch (err) {
      console.warn("Failed to toggle notifications:", err);
      return false;
    }
  }, [enabled]);

  // Monitor next prayer countdown for notification trigger
  useEffect(() => {
    if (!enabled || !nextPrayer || !permissionGranted) return;

    const dateStr = nextPrayer.date.toISOString().split("T")[0];
    const eventKey = `${dateStr}_${nextPrayer.key}`;

    // If remainingSeconds is <= 2 and we haven't notified for this prayer event yet
    if (nextPrayer.remainingSeconds <= 2 && !notifiedSetRef.current.has(eventKey)) {
      notifiedSetRef.current.add(eventKey);

      try {
        if (Notifications && typeof Notifications.scheduleNotificationAsync === "function") {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `🕌 Time for ${nextPrayer.name}!`,
              body: `It is now time for ${nextPrayer.name} prayer (${nextPrayer.timeStr}).`,
              sound: true,
            },
            trigger: null,
          }).catch((err) => {
            console.error("Error triggering prayer notification:", err);
          });
        }
      } catch (err) {
        console.warn("Notification scheduling failed:", err);
      }
    }
  }, [nextPrayer, enabled, permissionGranted]);

  return {
    enabled,
    permissionGranted,
    toggleNotifications,
  };
}
