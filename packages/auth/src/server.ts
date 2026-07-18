import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isMockEnabled, createMockServerClient } from "./mock";

/**
 * Create a Supabase client for use in server components and server actions.
 * Handles cookie management for session persistence.
 *
 * When NEXT_PUBLIC_AUTH_MOCK=true, returns a mock client with dummy
 * credentials (test@test.com / password123).
 */
export async function createClient() {
  const cookieStore = await cookies();

  if (isMockEnabled()) {
    return createMockServerClient({
      getSession: () => cookieStore.get('mock_session')?.value,
      setSession: () => {
        try {
          cookieStore.set('mock_session', 'true', { path: '/' });
        } catch {
          // Ignored in Server Components
        }
      },
      clearSession: () => {
        try {
          cookieStore.delete('mock_session');
        } catch {
          // Ignored in Server Components
        }
      }
    }) as any;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
