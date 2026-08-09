import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Node-only adapters/providers here).
 * Expand with credentials / OAuth providers in config.ts as needed.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
