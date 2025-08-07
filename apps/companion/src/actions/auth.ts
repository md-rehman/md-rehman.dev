"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthError, AuthResponse } from "@supabase/supabase-js";

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

  try {
    await supabase.auth.signUp(incomingData);
    redirect("/prayers_strict");
  } catch (error) {
    return { data: { user: null, session: null }, error: error as AuthError };
  }
  return { data: { user: null, session: null }, error: null };
}

export async function signIn(formData: ISignIn): Promise<AuthResponse> {
  const supabase = await createClient();
  try {
    await supabase.auth.signInWithPassword(formData);
    redirect("/prayers_strict");
  } catch (error) {
    return { data: { user: null, session: null }, error: error as AuthError };
  }
  return { data: { user: null, session: null }, error: null };
}

export async function signOut() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    redirect("/login");
  } catch (error) {}
}
