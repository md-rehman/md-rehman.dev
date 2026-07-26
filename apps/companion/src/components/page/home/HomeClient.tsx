"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@repo/atomic-ui/compounds";
import { DateRuler } from "@/components/page/home/DateRuler";
import { PrayerTrackerRadial } from "@/components/page/home/PrayerTrackerRadial";
import { NextPrayerTimer } from "@/components/page/home/NextPrayerTimer";
import { AppTray } from "@/components/page/home/AppTray";
import styles from "@/app/page.module.css";

import { COMPANION_LINKS, getTodayStr } from "./constants";

export function HomeClient({ prayers: initialPrayers }: { prayers?: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr);
  const [prayers, setPrayers] = useState<any[]>(initialPrayers || []);

  // Sync state if server prop changes
  useEffect(() => {
    setPrayers(initialPrayers || []);
  }, [initialPrayers]);


  return (
    <div className={styles.homescreen}>
      <Navbar links={COMPANION_LINKS} />

      <div className={styles.dateSection}>
        <DateRuler
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>

      <div style={{ width: "100%", padding: "0 1rem", zIndex: 1 }}>
        <NextPrayerTimer selectedDate={selectedDate} />
      </div>

      <div className={styles.trackerSection}>
        <PrayerTrackerRadial
          selectedDate={selectedDate}
          prayersData={prayers}
          onPrayersUpdate={setPrayers}
        />
      </div>
      <AppTray />
    </div>
  );
}
