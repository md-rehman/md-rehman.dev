"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export interface GuestLoginOptions {
  captchaToken?: string;
  redirectTo?: string;
}

/**
 * Server action for logging in anonymously as a guest using Supabase.
 * Accepts either a FormData instance (from form submission) or GuestLoginOptions.
 */
export async function loginAsGuest(formDataOrOptions?: FormData | GuestLoginOptions) {
  const supabase = await createClient();

  let captchaToken: string | undefined;
  let redirectTo: string | undefined;

  if (formDataOrOptions && "get" in formDataOrOptions && typeof (formDataOrOptions as FormData).get === "function") {
    const formData = formDataOrOptions as FormData;
    captchaToken = (formData.get("captchaToken") as string) || undefined;
    redirectTo = (formData.get("redirectTo") as string) || undefined;
  } else if (formDataOrOptions) {
    const options = formDataOrOptions as GuestLoginOptions;
    captchaToken = options.captchaToken;
    redirectTo = options.redirectTo;
  }

  const { error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken,
    },
  });

  if (error) {
    const target = redirectTo || "/login";
    redirect(`${target}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/");
}
