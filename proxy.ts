import NextAuth from "next-auth";
import { authConfig, LOGIN_PATH } from "@lib/auth/auth.config";
import { canAccessRoute, hasAnyReadableModule } from "@lib/auth/permissions";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/backoffice")) {
    return NextResponse.next();
  }

  const permissions = req.auth?.user.permissions ?? [];

  // Handled before `canAccessRoute`, which knows only module routes.
  if (pathname === LOGIN_PATH) {
    return hasAnyReadableModule(permissions)
      ? NextResponse.redirect(new URL("/backoffice", req.url))
      : NextResponse.next();
  }

  if (!req.auth) {
    const login = new URL(LOGIN_PATH, req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  // Signed in, but their role reaches nothing here.
  if (!canAccessRoute(permissions, pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/backoffice/:path*"],
};
