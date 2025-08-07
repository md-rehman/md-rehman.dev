"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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

export async function signUp(incomingData: ISignUp) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp(incomingData);

  console.log("MYLOG: data, error: ", data, error);

  if (error) {
    // redirect("/error");
    console.log("MYLOG: data, error: ", data, error);
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");
}

export async function signIn(formData: ISignIn) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    // redirect("/error");
    console.log("MYLOG: error: ", error);
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");
}

export async function signOut() {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { error } = await supabase.auth.signOut();

  if (error) {
    // redirect("/error");
    console.log("MYLOG: data: ", error);
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");
}
