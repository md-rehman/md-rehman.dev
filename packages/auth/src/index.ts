/**
 * @repo/auth
 *
 * Shared Supabase authentication utilities for the md-rehman.dev monorepo.
 *
 * Exports:
 *   - `createClient` (from ./client) — browser client
 *   - `createClient` (from ./server) — server client
 *   - `updateSession` (from ./middleware) — Next.js middleware helper
 *
 * Mock mode:
 *   Set NEXT_PUBLIC_AUTH_MOCK=true in your .env to bypass Supabase.
 *   Dummy credentials: test@test.com / password123
 *
 * Usage:
 *   import { createClient } from "@repo/auth/client";
 *   import { createClient } from "@repo/auth/server";
 *   import { updateSession } from "@repo/auth/middleware";
 */

export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { updateSession } from "./middleware";
export type { AuthMiddlewareOptions } from "./middleware";
export { isMockEnabled, MOCK_USER, MOCK_CREDENTIALS } from "./mock";
