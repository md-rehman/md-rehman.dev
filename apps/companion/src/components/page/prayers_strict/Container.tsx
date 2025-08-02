"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import { usePrayersAPI } from "@/hooks/prayers";
import { useAuth, AuthProvider } from "@/providers/Auth";
import {
  prayers_strict,
  IPrayers_Strict,
  IPrayers_Strict_Group_By_Date,
} from "@/constants/mock_prayers_strict";

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
  const { addPrayer } = usePrayersAPI();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handleClick = (e: React.MouseEvent) => {
    const time = e.currentTarget.textContent || "";

    if (user?.id)
      addPrayer({
        user_id: user?.id,
        time,
        status: "Masjid",
        date: new Date().toISOString().split("T")[0],
      });
    else console.error("");
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // string in 'YYYY-MM-DD' format
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <header className="mb-10 flex flex-row">
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </header>
      <section className="flex w-full flex-wrap items-center justify-between">
        <Button onClick={handleClick} status={prayers[selectedDate]?.fajr}>
          Fajr
        </Button>
        <Button onClick={handleClick} status={prayers[selectedDate]?.dhuhr}>
          Dhuhr
        </Button>
        <Button onClick={handleClick} status={prayers[selectedDate]?.asr}>
          Asr
        </Button>
        <Button onClick={handleClick} status={prayers[selectedDate]?.maghrib}>
          Maghrib
        </Button>
        <Button onClick={handleClick} status={prayers[selectedDate]?.isha}>
          Isha
        </Button>
      </section>
    </main>
  );
};
