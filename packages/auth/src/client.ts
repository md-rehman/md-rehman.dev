import { createBrowserClient } from "@supabase/ssr";
import { isMockEnabled, createMockBrowserClient } from "./mock";

/**
 * Create a Supabase client for use in browser/client components.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * environment variables to be set.
 *
 * When NEXT_PUBLIC_AUTH_MOCK=true, returns a mock client.
 */
export function createClient() {
  if (isMockEnabled()) {
    return createMockBrowserClient() as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
