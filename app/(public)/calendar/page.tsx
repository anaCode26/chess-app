import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { Body, Label, Title } from "@components/ui/text";
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
          <Body className="max-w-prose">{events("empty")}</Body>
        ) : (
          <ol>
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 border-b border-hairline py-7 first:border-t sm:flex-row sm:items-baseline sm:gap-10"
              >
                <Label color="amber" className="shrink-0 sm:w-56">
                  {format.dateTime(new Date(`${event.date}T18:00:00Z`), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </Label>
                <Title size="md" as="span">
                  {event.title}
                </Title>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
