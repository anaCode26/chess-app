import type { Event } from "@prisma/client";
import { render } from "@react-email/render";
import { CLUB_TIMEZONE } from "@lib/club-night";
import { parseDateOnly, toISODate } from "@lib/date/month";
import { sendEmail } from "@lib/email/email-sender.service";
import { EventPublishedEmail } from "@lib/email/templates/event-published-email";
import { env } from "@lib/env";
import { userRepository } from "@repositories/user.repository";
import { signUnsubscribeToken } from "./unsubscribe-token";

/**
 * Above this the synchronous fan-out stops being appropriate and the send
 * belongs in an outbox processed by a cron route. Crossing it is logged rather
 * than enforced, so growth is visible before it becomes a problem.
 */
const NOTIFY_SYNC_LIMIT = 200;

function buildEventUrl(event: Event): string {
  const iso = toISODate(event.date);

  return `${env.NEXTAUTH_URL}/calendar?month=${iso.slice(0, 7)}#event-${event.id}`;
}

/** `parseDateOnly` re-anchors at noon so the club's calendar day cannot shift. */
function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: CLUB_TIMEZONE,
  }).format(parseDateOnly(toISODate(date)));
}

export const eventNotificationService = {
  /**
   * Announces an event to every subscribed active member. Never throws: a dead
   * mail server must not stop an admin from publishing.
   */
  async announcePublished(event: Event): Promise<void> {
    try {
      const recipients = await userRepository.findEventNotificationRecipients();
      if (recipients.length === 0) return;

      if (recipients.length > NOTIFY_SYNC_LIMIT) {
        console.warn(
          `[notifications] ${recipients.length} recipients exceeds the synchronous send limit of ${NOTIFY_SYNC_LIMIT}.`,
        );
      }

      const eventUrl = buildEventUrl(event);
      const dateLabel = formatDateLabel(event.date);
      const subject = `Nyt arrangement i klubben: ${event.title}`;

      const results = await Promise.allSettled(
        recipients.map(async (recipient) => {
          const unsubscribeUrl = `${env.NEXTAUTH_URL}/unsubscribe?token=${signUnsubscribeToken(recipient.id)}`;

          const html = await render(
            EventPublishedEmail({
              name: recipient.name,
              title: event.title,
              dateLabel,
              startTime: event.startTime,
              description: event.description,
              eventUrl,
              unsubscribeUrl,
            }),
          );

          await sendEmail({
            to: recipient.email,
            subject,
            html,
            headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
          });
        }),
      );

      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length > 0) {
        console.error(
          `[notifications] ${failed.length} of ${recipients.length} announcements failed for event ${event.id}.`,
          failed.map((result) => result.reason),
        );
      }
    } catch (error) {
      console.error(`[notifications] Announcement failed for event ${event.id}.`, error);
    }
  },
};
