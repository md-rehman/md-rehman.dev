import { createClient } from "@/utils/supabase/server";
import { PrayerTracker } from "@/components/page/prayer-tracker/PrayerTracker";
import {
  prayers_strict,
  prayer_strict_group_by_date,
  IPrayers_Strict,
} from "@/constants/mock_prayers_strict";

export default async function Prayers() {
  // const { NEXT_PUBLIC_MOCK_PRAYERS_STRICT_API } = process.env;

  // // if (NEXT_PUBLIC_MOCK_PRAYERS_STRICT_API) {
  // //   return <Container prayers={prayer_strict_group_by_date} />;
  // // }

  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // const { data, error } = await supabase.rpc("get_prayers_by_date", {
  //   target_user_id: user?.id,
  // });
  return <PrayerTracker />;
}
