import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@lib/env";

/**
 * An HMAC over the user id, so unsubscribe links need no token table. They
 * deliberately never expire: a link in a two-year-old email must still work.
 */
function signature(userId: string): string {
  return createHmac("sha256", env.NEXTAUTH_SECRET).update(userId).digest("base64url");
}

export function signUnsubscribeToken(userId: string): string {
  return `${Buffer.from(userId).toString("base64url")}.${signature(userId)}`;
}

/** Returns the user id, or null if the token is malformed or tampered with. */
export function verifyUnsubscribeToken(token: string): string | null {
  const [encodedId, provided] = token.split(".");
  if (!encodedId || !provided) return null;

  const userId = Buffer.from(encodedId, "base64url").toString("utf8");
  if (!userId) return null;

  const expected = Buffer.from(signature(userId));
  const candidate = Buffer.from(provided);

  if (candidate.length !== expected.length) return null;
  if (!timingSafeEqual(candidate, expected)) return null;

  return userId;
}
