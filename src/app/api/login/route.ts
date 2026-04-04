import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "NAB2026";
const COOKIE = "nab_auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Expires end of NAB week
    expires: new Date("2026-04-23T23:59:59Z"),
  });
  return response;
}
