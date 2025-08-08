"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

type ISignUp = {
  email: string;
  password: string;
  options?: {
    data: {
      user_name: string;
    };
  };
};

type ISignIn = {
  email: string;
  password: string;
};

export async function signUp(incomingData: ISignUp): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp(incomingData);

  revalidatePath("/", "layout");
  // redirect("/prayers_strict");
  redirect("/prayer-tracker");
  return { data: { user: null, session: null }, error: error as AuthError };
}

export async function signIn(formData: ISignIn): Promise<AuthResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(formData);
  console.log("MYLOG: error: ", error);

  revalidatePath("/", "layout");
  // redirect("/prayers_strict");
  redirect("/prayer-tracker");
  return { data: { user: null, session: null }, error: error as AuthError };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  // revalidatePath("/", "layout");
  redirect("/login");
}
