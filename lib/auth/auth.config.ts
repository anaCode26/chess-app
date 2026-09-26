import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

/** Sign-in is for officers entering the backoffice — never linked from the public site. */
export const LOGIN_PATH = "/backoffice/login";

/**
 * Edge-safe Auth.js config (no Node-only adapters/providers here).
 * Credentials live in `auth.ts` so this file can run in `proxy.ts`.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: LOGIN_PATH,
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
        // A snapshot: it gates navigation, while actions re-read the database.
        token.permissions = user.permissions;
      }
      return token;
    },
    session({ session, token }) {
      // Auth.js widens the token here; the `jwt` callback above is what put
      // these fields on it.
      const { id, roleId, roleName, permissions } = token as JWT;

      session.user.id = id;
      session.user.roleId = roleId;
      session.user.roleName = roleName;
      session.user.permissions = permissions;
      return session;
    },
  },
} satisfies NextAuthConfig;
