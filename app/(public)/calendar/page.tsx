import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { getPublishedEventsInMonth } from "@actions/event/event.actions";
import { EventRows } from "@components/features/calendar/event-rows";
import { MonthGrid } from "@components/features/calendar/month-grid";
import { MonthNav } from "@components/features/calendar/month-nav";
import { PageHeader } from "@components/common/page-header";
import {
  buildMonthCells,
  monthAnchor,
  parseDateOnly,
  parseMonthParam,
  todayISO,
  weekdayAnchors,
} from "@lib/date/month";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calendarPage");

  return { title: t("title"), description: t("description") };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = parseMonthParam(monthParam);

  const [t, format, events] = await Promise.all([
    getTranslations("calendarPage"),
    getFormatter(),
    getPublishedEventsInMonth(month),
  ]);

  const monthLabel = format.dateTime(monthAnchor(month), {
    month: "long",
    year: "numeric",
  });
  const weekdayLabels = weekdayAnchors().map((date) =>
    format.dateTime(date, { weekday: "short" }),
  );
  const datedEvents = events.map((event) => ({
    ...event,
    dateLabel: formatEventDate(format, event.date, event.startTime),
  }));

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <MonthNav
          month={month}
          href="/calendar"
          label={monthLabel}
          copy={{
            previous: t("monthGrid.previous"),
            next: t("monthGrid.next"),
            today: t("monthGrid.today"),
          }}
        />

        <div className="mt-10">
          <MonthGrid
            cells={buildMonthCells(month, todayISO())}
            weekdayLabels={weekdayLabels}
            events={events}
            moreTemplate={t.raw("monthGrid.more") as string}
            eventHrefPrefix="#event-"
          />
        </div>

        <div className="mt-16">
          <EventRows events={datedEvents} empty={t("noEvents")} />
        </div>
      </div>
    </>
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
