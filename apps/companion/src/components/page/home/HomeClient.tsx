"use client";

import { useState } from "react";
import { Navbar } from "@repo/atomic-ui/compounds";
import { DateRuler } from "@/components/page/home/DateRuler";
import { PrayerTrackerRadial } from "@/components/page/home/PrayerTrackerRadial";
import { PrayerTrackerHorizontal } from "@/components/page/home/PrayerTrackerHorizontal";
import { PrayerTrackerVertical } from "@/components/page/home/PrayerTrackerVertical";
import { AppTray } from "@/components/page/home/AppTray";
import { AuthProvider } from "@/providers/Auth";
import styles from "@/app/page.module.css";

const COMPANION_LINKS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/companion/prayers", icon: "🕌", label: "Prayers" },
  { href: "/companion/prayers_strict", icon: "📿", label: "Strict" },
];

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function HomeClient() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr);

  return (
    <AuthProvider>
      <div className={styles.homescreen}>
        <Navbar links={COMPANION_LINKS} />

        <div className={styles.dateSection}>
          <DateRuler
            onDateChange={setSelectedDate}
            selectedDate={selectedDate}
          // startDate="1-06-2026"
          // endDate={"13-06-2026"}
          />
        </div>

        <div className={styles.trackerSection}>
          <PrayerTrackerRadial selectedDate={selectedDate} />
        </div>
        <AppTray />
      </div>
    </AuthProvider>
  );
}
