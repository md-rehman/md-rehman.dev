/**
 * Mock auth utilities for local development.
 *
 * When NEXT_PUBLIC_AUTH_MOCK=true, the auth package bypasses Supabase
 * and uses hardcoded dummy credentials instead.
 *
 * Dummy credentials:
 *   Email:    test@test.com
 *   Password: password123
 */

// ── Mock User ──────────────────────────────────────────────────────

export const MOCK_USER = {
  id: "mock-user-00000000-0000-0000-0000-000000000000",
  email: "test@test.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2025-01-01T00:00:00.000Z",
} as const;

export const MOCK_CREDENTIALS = {
  email: "test@test.com",
  password: "password123",
} as const;

// ── Helpers ────────────────────────────────────────────────────────

export function isMockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_MOCK === "true";
}

// ── Mock Supabase-like client (server) ─────────────────────────────

/**
 * Returns a mock object that mimics the Supabase client API surface
 * used by the apps (auth.getUser, auth.signInWithPassword, auth.signUp, etc.)
 */
export function createMockServerClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: MOCK_USER as any },
        error: null,
      }),
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        if (
          email === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          return { data: { user: MOCK_USER as any, session: {} }, error: null };
        }
        return {
          data: { user: null, session: null },
          error: { message: "Invalid credentials", status: 401 },
        };
      },
      signUp: async ({ email }: { email: string; password: string }) => {
        return { data: { user: { ...MOCK_USER, email } as any }, error: null };
      },
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({
        data: { session: {} },
        error: null,
      }),
    },
    // Stub for any .from() calls (companion uses these)
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => ({
        select: () => Promise.resolve({ data: [data], error: null }),
      }),
    }),
  };
}

// ── Mock Supabase-like client (browser) ────────────────────────────

export function createMockBrowserClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: MOCK_USER as any },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (
        callback: (event: string, session: any) => void,
      ) => {
        // Fire immediately with a mock session
        callback("SIGNED_IN", { user: MOCK_USER });
        return {
          data: {
            subscription: { unsubscribe: () => {} },
          },
        };
      },
    },
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => ({
        select: () => Promise.resolve({ data: [data], error: null }),
      }),
    }),
  };
}
