"use client";
import { useState } from "react";
import { TrackingPannel } from "./TrackingPannel";
import { useApp } from "@/providers/App";
import { DAILY_PRAYERS } from "@/constants/mock_prayers_strict";

interface IMain {
  //   prayers: IPrayers_Strict_Group_By_Date;
}
export const Main: React.FC<IMain> = () => {
  const { prayers } = useApp();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // string in 'YYYY-MM-DD' format
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  const trackingPannelPrayers = prayers
    ? prayers[selectedDate] || DAILY_PRAYERS
    : DAILY_PRAYERS;

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <header className="mb-20 flex flex-row">
        <input
          className="dark:shadow-bulge-dark px-8 py-2"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </header>
      <TrackingPannel
        selectedDate={selectedDate}
        prayers={trackingPannelPrayers}
      />
    </main>
  );
};
