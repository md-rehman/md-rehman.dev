"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
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
  console.log("MYLOG: prayers: ", prayers);

  const { user } = useAuth();
  // const { addPrayer } = usePrayersStrictAPI();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handlePrayerUpdate = (
    e: React.MouseEvent,
    prayerTime: I_PRAYER_TIME,
    prayerStatus: I_PRAYER_STATUS,
  ) => {
    // const time = e.currentTarget.textContent || "";
    const prayerData: any = {
      user_id: user?.id,
      date: selectedDate,
      [prayerTime]: prayerStatus,
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
      <section className="flex w-full flex-wrap items-center justify-between">
        <Button
          onClick={(e) => handlePrayerUpdate(e, "fajr", "done")}
          status={prayers[selectedDate]?.fajr}
        >
          Fajr
        </Button>
        <Button
          onClick={(e) => handlePrayerUpdate(e, "dhuhr", "done")}
          status={prayers[selectedDate]?.dhuhr}
        >
          Dhuhr
        </Button>
        <Button
          onClick={(e) => handlePrayerUpdate(e, "asr", "done")}
          status={prayers[selectedDate]?.asr}
        >
          Asr
        </Button>
        <Button
          onClick={(e) => handlePrayerUpdate(e, "maghrib", "done")}
          status={prayers[selectedDate]?.maghrib}
        >
          Maghrib
        </Button>
        <Button
          onClick={(e) => handlePrayerUpdate(e, "isha", "done")}
          status={prayers[selectedDate]?.isha}
        >
          Isha
        </Button>
      </section>

      <Test />
    </main>
  );
};


const Test = () => {
  const parentVariants = {
  initial: {},
  hover: {},
};

const childVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { rotate: 90, scale: 1.5 },
};
  return (
    <motion.button
      variants={parentVariants}
      initial="initial"
      whileHover="hover"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem 2rem",
        fontSize: "1.2rem",
      }}
    >
      <span style={{ marginRight: 12 }}>Visit our Industry</span>
      <motion.span
        variants={childVariants}
        style={{ display: "inline-block" }}
      >
        ↑
      </motion.span>
    </motion.button>
  );
}