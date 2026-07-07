"use client";

import { useState } from "react";
import { Navbar } from "@repo/atomic-ui/compounds";
import { DateRuler } from "@/components/page/home/DateRuler";
import { PrayerTrackerRadial } from "@/components/page/home/PrayerTrackerRadial";
import { AppTray } from "@/components/page/home/AppTray";
import styles from "@/app/page.module.css";

import { NavLink } from "@repo/atomic-ui/compounds";

const COMPANION_LINKS: NavLink[] = [
  { href: "/", icon: "🏠", label: "Home", size: "md" },
  { href: "/companion/prayers", icon: "🕌", label: "Prayers", size: "md" },
  { href: "/companion/prayers_strict", icon: "📿", label: "Strict", size: "md" },
];

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function HomeClient({ prayers }: { prayers?: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr);

  // TODO: remove it later
  console.log("Fetched prayers data:", prayers);


  return (
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
        <PrayerTrackerRadial selectedDate={selectedDate} prayersData={prayers} />
      </div>
      <AppTray />
    </div>
  );
}
