import { NextResponse } from "next/server";

// Not meant to be high-security — just a deterrent so this stays a
// personal, single-user site. Defaults to 858585; override with
// SITE_ACCESS_CODE if you ever want to change it without a code change.
const ACCESS_CODE = process.env.SITE_ACCESS_CODE || "858585";
const UNLOCK_COOKIE = "mathly_access";
const UNLOCK_VALUE = "granted";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };

  if (code !== ACCESS_CODE) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(UNLOCK_COOKIE, UNLOCK_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return res;
}
