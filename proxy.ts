import NextAuth from "next-auth";
import { authConfig, LOGIN_PATH } from "@lib/auth/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/backoffice")) {
    return NextResponse.next();
  }

  const isAdmin = req.auth?.user.role === "ADMIN";

  if (pathname === LOGIN_PATH) {
    return isAdmin
      ? NextResponse.redirect(new URL("/backoffice", req.url))
      : NextResponse.next();
  }

  if (!req.auth) {
    const login = new URL(LOGIN_PATH, req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/backoffice/:path*"],
};
