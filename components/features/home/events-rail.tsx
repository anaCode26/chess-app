import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { getUpcomingEvents } from "@actions/event/event.actions";
import { Body, Caption, Label, Title } from "@components/ui/text";
import { parseDateOnly } from "@lib/date/month";

const RAIL_LIMIT = 4;

/** One amber line strung through the next few evenings, as in the comp. */
export async function EventsRail() {
  const [t, format, events] = await Promise.all([
    getTranslations("events"),
    getFormatter(),
    getUpcomingEvents(RAIL_LIMIT),
  ]);

  return (
    <section aria-labelledby="kommende" className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <Label as="h2" id="kommende" color="amber">
          {t("heading")}
        </Label>
        <Link
          href="/calendar"
          className="rounded-sm text-silver underline decoration-hairline underline-offset-8 transition-colors duration-200 hover:text-chalk"
        >
          <Label color="inherit">{t("all")}</Label>
        </Link>
      </div>

      {events.length === 0 ? (
        <Body className="mt-8 max-w-prose">{t("empty")}</Body>
      ) : (
        <ol className="relative mt-14 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute inset-x-[12%] top-[6px] hidden h-px bg-amber/55 lg:block"
          />

          {events.map((event) => {
            const dateLabel = format.dateTime(parseDateOnly(event.date), {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

            return (
              <li key={event.id} className="relative flex flex-col items-center px-4 pt-9 text-center">
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[6px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
                />
                <Title size="sm" as="p">
                  <Link
                    href={`/calendar?month=${event.date.slice(0, 7)}#event-${event.id}`}
                    className="rounded-sm"
                  >
                    {event.title}
                  </Link>
                </Title>
                <Caption className="mt-2">
                  {event.startTime ? `${dateLabel} · ${event.startTime}` : dateLabel}
                </Caption>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
