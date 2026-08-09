import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * App Auth.js instance. Add Credentials / OAuth providers and the Prisma
 * adapter here as the domain grows (see eet1-concordia lib/auth/config.ts).
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [...authConfig.providers],
});
