import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { upcomingEvents } from "@lib/content/club";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calendarPage");

  return { title: t("title"), description: t("description") };
}

export default async function CalendarPage() {
  const [t, events, format] = await Promise.all([
    getTranslations("calendarPage"),
    getTranslations("events"),
    getFormatter(),
  ]);

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        {upcomingEvents.length === 0 ? (
          <p className="max-w-prose leading-relaxed text-silver">{events("empty")}</p>
        ) : (
          <ol>
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 border-b border-hairline py-7 first:border-t sm:flex-row sm:items-baseline sm:gap-10"
              >
                <span className="label-caps shrink-0 text-[0.75rem] text-amber sm:w-56">
                  {format.dateTime(new Date(`${event.date}T18:00:00Z`), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="font-display text-2xl uppercase leading-tight text-chalk">
                  {event.title}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
