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
 * Includes honeypot bot detection to prevent automated sign-in spam.
 */
export async function loginAsGuest(formDataOrOptions?: FormData | GuestLoginOptions) {
  let captchaToken: string | undefined;
  let redirectTo: string | undefined;

  if (formDataOrOptions && "get" in formDataOrOptions && typeof (formDataOrOptions as FormData).get === "function") {
    const formData = formDataOrOptions as FormData;

    // Honeypot check: Bots automatically fill hidden inputs
    const honeypotVal = formData.get("user_website_trap");
    if (honeypotVal && typeof honeypotVal === "string" && honeypotVal.trim().length > 0) {
      console.warn("[Auth] Honeypot triggered. Aborting bot guest sign-in.");
      redirect("/");
    }

    captchaToken = (formData.get("captchaToken") as string) || undefined;
    redirectTo = (formData.get("redirectTo") as string) || undefined;
  } else if (formDataOrOptions) {
    const options = formDataOrOptions as GuestLoginOptions;
    captchaToken = options.captchaToken;
    redirectTo = options.redirectTo;
  }

  const supabase = await createClient();

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
