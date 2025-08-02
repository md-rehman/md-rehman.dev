"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function addPrayer(formData: FormData) {
  const supabase = await createClient();

  const { data: prayers } = await supabase.from("prayers").select();

  // type-casting here for convenience
  // in practice, you should validate your inputs
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
