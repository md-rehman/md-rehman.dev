"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@repo/ui";
import { DateRuler } from "@/components/page/home/DateRuler";
import { PrayerTrackerRadial } from "@/components/page/home/PrayerTrackerRadial";
import { NextPrayerTimer } from "@/components/page/home/NextPrayerTimer";
import { AppTray, APPS, AppItem } from "@/components/page/home/AppTray";
import styles from "@/app/page.module.css";

import { COMPANION_LINKS, getTodayStr } from "./constants";

export function HomeClient({ prayers: initialPrayers }: { prayers?: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr);
  const [prayers, setPrayers] = useState<any[]>(initialPrayers || []);
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);

  // Sync state if server prop changes
  useEffect(() => {
    setPrayers(initialPrayers || []);
  }, [initialPrayers]);

  const handleOpenPrayersApp = () => {
    const prayersApp = APPS.find((a) => a.id === "prayers") || null;
    setActiveApp(prayersApp);
  };

  return (
    <div className={styles.homescreen}>
      <Navbar links={COMPANION_LINKS} />

      <div className={styles.dateSection}>
        <DateRuler
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>

      <div style={{ width: "100%", padding: "0.5rem 1rem", zIndex: 1 }}>
        <NextPrayerTimer
          selectedDate={selectedDate}
          onOpenPrayersApp={handleOpenPrayersApp}
        />
      </div>

      <div className={styles.trackerSection}>
        <PrayerTrackerRadial
          selectedDate={selectedDate}
          prayersData={prayers}
          onPrayersUpdate={setPrayers}
        />
      </div>

      <AppTray activeApp={activeApp} onSelectApp={setActiveApp} />
    </div>
  );
}
