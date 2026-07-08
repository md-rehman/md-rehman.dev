"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@repo/auth/server";

export async function addPrayer(formData: FormData) {
  const supabase = await createClient();

  const { data: prayers } = await supabase.from("prayers_strict").select();
  // .eq(user_id === 'logged_in_user');

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const mockData = { userId: "", time: "Asr", status: "Masjid" };
  const { error } = await supabase.from("prayers").insert(data);

  //   const { error } = await supabase.auth.signInWithPassword(data);
  //   if (error) {
  //     // redirect("/error");
  //   }

  //   revalidatePath("/", "layout");
  //   redirect("/");
}

export async function saveDayPrayers(payload: {
  date: string;
  prayers: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string };
  id?: number;
}) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("Unauthorized");
  }

  const userId = userData.user.id;

  if (payload.id) {
    const { data, error } = await supabase
      .from("prayers")
      .update({
        fajr: payload.prayers.fajr,
        dhuhr: payload.prayers.dhuhr,
        asr: payload.prayers.asr,
        maghrib: payload.prayers.maghrib,
        isha: payload.prayers.isha,
      })
      .eq("id", payload.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } else {
    const { data, error } = await supabase
      .from("prayers")
      .insert({
        user_id: userId,
        date: payload.date,
        fajr: payload.prayers.fajr,
        dhuhr: payload.prayers.dhuhr,
        asr: payload.prayers.asr,
        maghrib: payload.prayers.maghrib,
        isha: payload.prayers.isha,
      })
      .select()
      .single();

    if (error) throw error;
    return { data };
  }
}
