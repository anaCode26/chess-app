import type { EventOccurrence, SerializedEvent } from "@actions/event/event.types";
import { occurrencesInMonth } from "@lib/date/series";
import type { MonthKey } from "@lib/date/month";

export function expandOccurrencesInMonth(
  events: SerializedEvent[],
  month: MonthKey,
): EventOccurrence[] {
  const occurrences = events.flatMap((event) =>
    occurrencesInMonth(event.date, event.endDate, event.skippedDates, month).map(
      (occurrenceDate) => ({ ...event, occurrenceDate }),
    ),
  );

  return occurrences.sort((left, right) => {
    const byDate = left.occurrenceDate.localeCompare(right.occurrenceDate);
    if (byDate !== 0) return byDate;
    return (left.startTime ?? "").localeCompare(right.startTime ?? "");
  });
}

export function groupEventsByDate(
  events: EventOccurrence[],
): Map<string, EventOccurrence[]> {
  const map = new Map<string, EventOccurrence[]>();

  for (const event of events) {
    const list = map.get(event.occurrenceDate) ?? [];
    list.push(event);
    map.set(event.occurrenceDate, list);
  }

  return map;
}

export function occurrenceAnchorId(event: EventOccurrence): string {
  return `event-${event.id}-${event.occurrenceDate}`;
}

export function seriesAnchorId(eventId: string): string {
  return `event-${eventId}`;
}
