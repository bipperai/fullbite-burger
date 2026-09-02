import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, parseSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/yonetim")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/yonetim/giris")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (await parseSessionToken(token)) {
      return NextResponse.redirect(new URL("/yonetim", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await parseSessionToken(token))) {
    const login = new URL("/yonetim/giris", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/yonetim/:path*"],
};
