import { PrayerButton } from "@/components/ui/Button";
import { useAuth } from "@/providers/Auth";
import {
  IDailyPrayers,
  IDailyPrayersObject,
} from "@/constants/mock_prayers_strict";
import type { I_PRAYER_STATUS, I_PRAYER_TIME } from "@/types/fundamental";
import { addOrUpdatePrayer } from "@/actions/prayers";

interface ITrackingPannel {
  prayers: IDailyPrayers | IDailyPrayersObject;
  selectedDate: string;
}

export const TrackingPannel: React.FC<ITrackingPannel> = ({
  selectedDate,
  prayers,
}) => {
  const { user } = useAuth();

  const handlePrayerUpdate = (
    e: React.MouseEvent,
    prayerTime: I_PRAYER_TIME,
    prayerStatus: I_PRAYER_STATUS,
  ) => {
    // const time = e.currentTarget.textContent || "";
    const existingStatus = prayers[prayerTime];
    // const computedStatus =
    const prayerData: any = {
      user_id: user?.id,
      date: selectedDate,
      [prayerTime]:
        existingStatus === prayerStatus ? "untracked" : prayerStatus,
    };
    if ("id" in prayers) {
      // In this block, prayers is IDailyPrayersObject
      prayerData.id = prayers.id;
    }

    if (user?.id) addOrUpdatePrayer(prayerData);
    else console.error("Unable to find the logged in user");
  };

  return (
    <section className="w-full text-center">
      <PrayerButton
        onClick={(e) => handlePrayerUpdate(e, "fajr", "done")}
        time="fajr"
        status={prayers.fajr || "untracked"}
        handlePrayerUpdate={handlePrayerUpdate}
      >
        Fajr
      </PrayerButton>
      <PrayerButton
        onClick={(e) => handlePrayerUpdate(e, "dhuhr", "done")}
        time="dhuhr"
        status={prayers.dhuhr || "untracked"}
        handlePrayerUpdate={handlePrayerUpdate}
      >
        Dhuhr
      </PrayerButton>
      <PrayerButton
        onClick={(e) => handlePrayerUpdate(e, "asr", "done")}
        time="asr"
        status={prayers.asr || "untracked"}
        handlePrayerUpdate={handlePrayerUpdate}
      >
        Asr
      </PrayerButton>
      <PrayerButton
        onClick={(e) => handlePrayerUpdate(e, "maghrib", "done")}
        time="maghrib"
        status={prayers.maghrib || "untracked"}
        handlePrayerUpdate={handlePrayerUpdate}
      >
        Maghrib
      </PrayerButton>
      <PrayerButton
        onClick={(e) => handlePrayerUpdate(e, "isha", "done")}
        time="isha"
        status={prayers.isha || "untracked"}
        handlePrayerUpdate={handlePrayerUpdate}
      >
        Isha
      </PrayerButton>
    </section>
  );
};
