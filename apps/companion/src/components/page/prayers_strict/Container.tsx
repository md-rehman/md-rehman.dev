"use client";
import { useState } from "react";
import { PrayerButton } from "@/components/ui/Button";
import { usePrayersStrictAPI } from "@/hooks/prayers";
import { useAuth, AuthProvider } from "@/providers/Auth";
import {
  prayers_strict,
  IPrayers_Strict,
  IPrayers_Strict_Group_By_Date,
} from "@/constants/mock_prayers_strict";
import type { I_PRAYER_STATUS, I_PRAYER_TIME } from "@/types/fundamental";
import { addOrUpdatePrayer } from "@/actions/prayers";
import { motion } from "framer-motion";

interface IMain {
  prayers: IPrayers_Strict_Group_By_Date;
}

export const Container: React.FC<IMain> = ({ prayers }) => {
  return (
    <AuthProvider>
      <Main prayers={prayers} />
    </AuthProvider>
  );
};

export const Main: React.FC<IMain> = ({ prayers }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    // new Date().toISOString().split("T")[0],
    "2025-07-20"
  );
  const existingState = prayers ? prayers[selectedDate] :  null;
  

  const handlePrayerUpdate = (
    e: React.MouseEvent,
    prayerTime: I_PRAYER_TIME,
    prayerStatus: I_PRAYER_STATUS,
  ) => {
    // const time = e.currentTarget.textContent || "";
    const existingStatus = prayers[selectedDate]?.[prayerTime];
    // const computedStatus = 
    const prayerData: any = {
      user_id: user?.id,
      date: selectedDate,
      [prayerTime]: existingStatus === prayerStatus ? "untracked" : prayerStatus,
    };
    if (prayers[selectedDate]?.id) {
      prayerData.id = prayers[selectedDate]?.id;
    }
    if (user?.id) addOrUpdatePrayer(prayerData);
    else console.error("Unable to find the logged in user");
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // string in 'YYYY-MM-DD' format
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <header className="mb-20 flex flex-row">
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </header>
      <section className="w-full text-center">
        <PrayerButton
          onClick={(e) => handlePrayerUpdate(e, "fajr", "done")}
          time="fajr"
          status={existingState ? existingState?.fajr : 'untracked'}
          handlePrayerUpdate={handlePrayerUpdate}

        >
          Fajr
        </PrayerButton>
        <PrayerButton
          onClick={(e) => handlePrayerUpdate(e, "dhuhr", "done")}
          time="dhuhr"
          status={existingState ? existingState?.dhuhr : 'untracked'}
          handlePrayerUpdate={handlePrayerUpdate}
        >
          Dhuhr
        </PrayerButton>
        <PrayerButton
          onClick={(e) => handlePrayerUpdate(e, "asr", "done")}
          time="asr"
          status={existingState ? existingState?.asr : 'untracked'}
          handlePrayerUpdate={handlePrayerUpdate}
        >
          Asr
        </PrayerButton>
        <PrayerButton
          onClick={(e) => handlePrayerUpdate(e, "maghrib", "done")}
          time="maghrib"
          status={existingState ? existingState?.maghrib : 'untracked'}
          handlePrayerUpdate={handlePrayerUpdate}
        >
          Maghrib
        </PrayerButton>
        <PrayerButton
          onClick={(e) => handlePrayerUpdate(e, "isha", "done")}
          time="isha"
          status={existingState ? existingState?.isha : 'untracked'}
          handlePrayerUpdate={handlePrayerUpdate}
        >
          Isha
        </PrayerButton>
      </section>

      <Test />
    </main>
  );
};


const Test = () => {
  return null;
}