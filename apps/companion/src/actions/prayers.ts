"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { I_PRAYER_STATUS, I_PRAYER_TIME } from "@/types/fundamental";

type IPrayerRecord = { [K in I_PRAYER_TIME]?: I_PRAYER_STATUS } & {
  id?: number;
  user_id: string;
  date: string;
};

export async function addOrUpdatePrayer(prayersRecord: IPrayerRecord) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("prayers_strict")
    .upsert(prayersRecord)
    .select();

  //   const { error } = await supabase.auth.signInWithPassword(data);
  //   if (error) {
  //     // redirect("/error");
  //   }

  revalidatePath("/prayers_strict", "page");
  //   redirect("/");
}
