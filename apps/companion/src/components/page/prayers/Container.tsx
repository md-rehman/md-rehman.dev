"use client";

import { PrayerButton } from "@/components/ui/Button";
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
      <PrayerButton onClick={clickHandler} status="">
        Fajr
      </PrayerButton>
      <PrayerButton onClick={clickHandler}>Dhuhr</PrayerButton>
      <PrayerButton onClick={clickHandler}>Asr</PrayerButton>
      <PrayerButton onClick={clickHandler}>Maghrib</PrayerButton>
      <PrayerButton onClick={clickHandler}>Isha</PrayerButton>
    </div>
  );
};
