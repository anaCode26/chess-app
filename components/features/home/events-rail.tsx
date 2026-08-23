import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Body, Caption, Label, Title } from "@components/ui/text";
import { upcomingEvents } from "@lib/content/club";

const RAIL_LIMIT = 4;

/** One amber line strung through the next few evenings, as in the comp. */
export async function EventsRail() {
  const [t, format] = await Promise.all([
    getTranslations("events"),
    getFormatter(),
  ]);

  const events = upcomingEvents.slice(0, RAIL_LIMIT);

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

          {events.map((event) => (
            <li key={event.id} className="relative flex flex-col items-center px-4 pt-9 text-center">
              <span
                aria-hidden
                className="absolute left-1/2 top-[6px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
              />
              <Title size="sm" as="p">
                {event.title}
              </Title>
              <Caption className="mt-2">
                {format.dateTime(new Date(`${event.date}T18:00:00Z`), {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Caption>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
