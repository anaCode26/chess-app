import type { NextAuthConfig } from "next-auth";

/** Sign-in is for officers entering the backoffice — never linked from the public site. */
export const LOGIN_PATH = "/backoffice/login";

/**
 * Edge-safe Auth.js config (no Node-only adapters/providers here).
 * Credentials live in `config.ts` so this file can run in `proxy.ts`.
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
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as typeof session.user.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
