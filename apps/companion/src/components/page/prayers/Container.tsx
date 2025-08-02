"use client";

import { Button } from "@/components/ui";
import { usePrayersAPI } from "@/hooks/prayers";
import { useAuth, AuthProvider } from "@/providers/Auth";

export const Container = () => {
  return (
    <AuthProvider>
      <PrayerTrackerCard />
    </AuthProvider>
  );
};

export const PrayerTrackerCard = () => {
  const { user } = useAuth();
  const { addPrayer } = usePrayersAPI();

  const clickHandler = (e: React.MouseEvent) => {
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

  return (
    <div>
      <Button onClick={clickHandler}>Fajr</Button>
      <Button onClick={clickHandler}>Dhuhr</Button>
      <Button onClick={clickHandler}>Asr</Button>
      <Button onClick={clickHandler}>Maghrib</Button>
      <Button onClick={clickHandler}>Isha</Button>
    </div>
  );
};
