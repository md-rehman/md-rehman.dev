import { type NextRequest } from "next/server";
import { updateSession } from "@repo/auth/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request, {
    loginPath: "/login",
    allowedPaths: ["/login", "/signup", "/auth"],
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
