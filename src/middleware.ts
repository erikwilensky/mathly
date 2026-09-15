import { NextResponse, type NextRequest } from "next/server";

const UNLOCK_COOKIE = "mathly_access";
const UNLOCK_VALUE = "granted";

export function middleware(req: NextRequest) {
  if (req.cookies.get(UNLOCK_COOKIE)?.value === UNLOCK_VALUE) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!unlock|api/unlock|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
