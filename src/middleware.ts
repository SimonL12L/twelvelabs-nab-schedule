import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "NAB2026";
const COOKIE = "nab_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its API through
  if (pathname === "/login") return NextResponse.next();

  // Check auth cookie
  if (request.cookies.get(COOKIE)?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to login
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
