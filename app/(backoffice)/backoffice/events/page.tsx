import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { getManagedEventsInMonth } from "@actions/event/event.actions";
import { EventsManager } from "@components/features/events/events-manager";
import { Body, Title } from "@components/ui/text";
import {
  buildMonthCells,
  monthAnchor,
  parseDateOnly,
  parseMonthParam,
  todayISO,
  weekdayAnchors,
} from "@lib/date/month";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("backoffice");

  return { title: t("events") };
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = parseMonthParam(monthParam);

  const [t, form, calendar, format, events] = await Promise.all([
    getTranslations("backoffice"),
    getTranslations("eventForm"),
    getTranslations("calendarPage"),
    getFormatter(),
    getManagedEventsInMonth(month),
  ]);

  const monthLabel = format.dateTime(monthAnchor(month), {
    month: "long",
    year: "numeric",
  });
  const weekdayLabels = weekdayAnchors().map((date) =>
    format.dateTime(date, { weekday: "short" }),
  );
  const dateLabels = Object.fromEntries(
    events.map((event) => [
      event.id,
      formatEventDate(format, event.date, event.startTime),
    ]),
  );

  return (
    <div>
      <Title as="h1" size="lg">
        {t("events")}
      </Title>
      <Body className="mt-3 max-w-prose">{t("eventsIntro")}</Body>

      <div className="mt-10">
        <EventsManager
          events={events}
          month={month}
          monthLabel={monthLabel}
          cells={buildMonthCells(month, todayISO())}
          weekdayLabels={weekdayLabels}
          dateLabels={dateLabels}
          copy={{
            create: t("create"),
            edit: t("edit"),
            draft: t("draft"),
            empty: t("empty"),
            previous: calendar("monthGrid.previous"),
            next: calendar("monthGrid.next"),
            today: calendar("monthGrid.today"),
            more: calendar.raw("monthGrid.more") as string,
            deleteConfirm: form("deleteConfirm"),
            form: {
              createTitle: form("createTitle"),
              editTitle: form("editTitle"),
              title: form("title"),
              date: form("date"),
              startTime: form("startTime"),
              startTimeHint: form("startTimeHint"),
              description: form("description"),
              published: form("published"),
              save: form("save"),
              create: form("create"),
              cancel: form("cancel"),
              delete: form("delete"),
              saving: form("saving"),
              close: form("close"),
            },
          }}
        />
      </div>
    </div>
  );
}

function formatEventDate(
  format: Awaited<ReturnType<typeof getFormatter>>,
  iso: string,
  startTime: string | null,
): string {
  const date = format.dateTime(parseDateOnly(iso), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return startTime ? `${date} · ${startTime}` : date;
}
