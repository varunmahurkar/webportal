/**
 * Nurav AI Next.js Proxy (Middleware file)
 * Handles authentication and role-based route protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  /** Default redirect for authenticated users accessing auth pages */
  defaultAuthenticatedRedirect: "/",
  /** Default redirect for unauthenticated users accessing protected pages */
  defaultUnauthenticatedRedirect: "/auth/signin",
} as const;

/**
 * Storage key for access token
 */
const ACCESS_TOKEN_KEY = "nurav_access_token";

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
 * Decode JWT token to extract payload (without verification)
 * Note: Actual verification should happen on the backend
 */
function decodeToken(token: string): { exp?: number; role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Proxy function to handle route protection
 */
export function proxy(request: NextRequest) {
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

  /** Get access token from cookies */
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const isAuthenticated = accessToken && !isTokenExpired(accessToken);

  /** Check if accessing protected route without authentication */
  if (matchesRoute(pathname, AUTH_CONFIG.protectedRoutes)) {
    if (!isAuthenticated) {
      const signinUrl = new URL(
        AUTH_CONFIG.defaultUnauthenticatedRedirect,
        request.url
      );
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }

    /** Check admin routes */
    if (matchesRoute(pathname, AUTH_CONFIG.adminRoutes)) {
      const payload = accessToken ? decodeToken(accessToken) : null;
      const userRole = payload?.role || "user";

      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  /** Redirect authenticated users away from auth pages */
  if (matchesRoute(pathname, AUTH_CONFIG.authOnlyRoutes)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(AUTH_CONFIG.defaultAuthenticatedRedirect, request.url)
      );
    }
  }

  return NextResponse.next();
}

/**
 * Proxy matcher configuration
 * Applies proxy to all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
