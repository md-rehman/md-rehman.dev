import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isMockEnabled, createMockServerClient } from "./mock";

export interface AuthMiddlewareOptions {
  /** Path to redirect unauthenticated users to (e.g. "/login" or "/planner/login"). */
  loginPath: string;
  /** Paths that should be accessible without authentication (prefix match). */
  allowedPaths?: string[];
}

/**
 * Supabase session middleware. Refreshes the session cookie and optionally
 * redirects unauthenticated users to a login page.
 *
 * When NEXT_PUBLIC_AUTH_MOCK=true, all requests are allowed through
 * without any authentication checks.
 *
 * @example
 * // in your app's middleware.ts
 * import { updateSession } from "@repo/auth/middleware";
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request, {
 *     loginPath: "/planner/login",
 *     allowedPaths: ["/planner/login", "/planner/signup", "/planner/auth"],
 *   });
 * }
 */
export async function updateSession(
  request: NextRequest,
  options?: AuthMiddlewareOptions,
) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = isMockEnabled()
    ? (createMockServerClient({
      getSession: () => request.cookies.get('mock_session')?.value,
      setSession: () => supabaseResponse.cookies.set('mock_session', 'true'),
      clearSession: () => supabaseResponse.cookies.delete('mock_session')
    }) as any)
    : createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If options are provided, enforce authentication redirects
  if (options) {
    const { loginPath, allowedPaths = [] } = options;
    const pathname = request.nextUrl.pathname;

    const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));

    if (!user && !isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
