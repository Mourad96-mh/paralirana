// ---------------------------------------------------------------------------
// Route guard. Protects the admin UI and admin API.
//   /admin/*      → redirect to /admin/login when unauthenticated
//   /api/admin/*  → 401 JSON when unauthenticated
// The /admin/login page itself is always allowed.
// Uses `jose` (edge runtime), so it verifies the JWT without Node APIs.
// ---------------------------------------------------------------------------

import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminApi && !session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (isAdminPage && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in but visiting the login page → send to dashboard.
  if (isLoginPage && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
