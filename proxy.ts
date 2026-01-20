/**
 * Nurav AI Next.js Proxy
 * Handles Supabase session refresh and role-based route protection
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route configuration for authentication protection
 */
const AUTH_CONFIG = {
  /** Routes that require authentication */
  protectedRoutes: ["/dashboard", "/profile", "/settings", "/admin"],
  /** Routes only accessible to unauthenticated users */
  authOnlyRoutes: ["/auth/signin", "/auth/signup", "/auth/forgot-password"],
  /** Routes that require admin role */
  adminRoutes: ["/admin"],
  /** Default redirect for unauthenticated users accessing protected pages */
  defaultUnauthenticatedRedirect: "/",
} as const;

/**
 * Check if a path matches any route pattern
 */
function matchesRoute(path: string, routes: readonly string[]): boolean {
  return routes.some((route) => {
    if (route.endsWith("*")) {
      return path.startsWith(route.slice(0, -1));
    }
    return path === route || path.startsWith(`${route}/`);
  });
}

/**
 * Proxy function to handle Supabase session and route protection
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** Skip proxy for static files and API routes */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  /** Initialize Supabase response for session handling */
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /** Get current user session */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  /** Check if accessing protected route without authentication */
  if (matchesRoute(pathname, AUTH_CONFIG.protectedRoutes)) {
    if (!isAuthenticated) {
      const redirectUrl = new URL(
        AUTH_CONFIG.defaultUnauthenticatedRedirect,
        request.url
      );
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

/**
 * Proxy matcher configuration
 * Applies proxy to all routes except static files
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
