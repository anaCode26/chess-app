"use server";

import { verifyUnsubscribeToken } from "@lib/notifications/unsubscribe-token";
import { userRepository } from "@repositories/user.repository";
import { unsubscribeSchema } from "./notification.types";

/**
 * No session required — the signed token is the credential, because the link is
 * clicked from an email client that is not logged in.
 */
export async function unsubscribeFromEventEmails(token: string): Promise<void> {
  const parsed = unsubscribeSchema.safeParse({ token });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid token.");
  }

  const userId = verifyUnsubscribeToken(parsed.data.token);
  if (!userId) {
    throw new Error("Invalid unsubscribe link.");
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("Invalid unsubscribe link.");
  }

  await userRepository.disableEventNotifications(userId);
}
