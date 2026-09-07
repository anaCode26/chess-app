import {
  monthRange,
  toISODate,
  toStoredDate,
  type MonthKey,
} from "@lib/date/month";

const DAY_MS = 24 * 60 * 60 * 1000;

/** `Date#getUTCDay()` — 0 Sunday through 6 Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function weekdayOf(iso: string): Weekday {
  return toStoredDate(iso).getUTCDay() as Weekday;
}

function addDays(iso: string, days: number): string {
  return toISODate(new Date(toStoredDate(iso).getTime() + days * DAY_MS));
}

/**
 * Weekly dates from `from` through `to`, on the same weekday as `from`.
 * The officer's start date is the rule — not a hardcoded club night.
 */
export function enumerateWeekdays(from: string, to: string): string[] {
  if (to < from) return [];

  const days: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    days.push(cursor);
    cursor = addDays(cursor, 7);
  }

  return days;
}

/**
 * Days the event actually runs. A missing `endDate` is a single occurrence on
 * `date`. A range repeats every week on the start date's weekday.
 */
export function includedDates(
  date: string,
  endDate: string | null,
  skippedDates: readonly string[] = [],
): string[] {
  const skipped = new Set(skippedDates);
  if (!endDate || endDate === date) {
    return skipped.has(date) ? [] : [date];
  }

  return enumerateWeekdays(date, endDate).filter((iso) => !skipped.has(iso));
}

export function nextIncludedDate(
  date: string,
  endDate: string | null,
  skippedDates: readonly string[],
  onOrAfter: string,
): string | null {
  return includedDates(date, endDate, skippedDates).find((iso) => iso >= onOrAfter) ?? null;
}

export function occurrencesInMonth(
  date: string,
  endDate: string | null,
  skippedDates: readonly string[],
  month: MonthKey,
): string[] {
  const { from, to } = monthRange(month);
  const startIso = toISODate(from);
  const endIso = toISODate(to);

  return includedDates(date, endDate, skippedDates).filter(
    (iso) => iso >= startIso && iso < endIso,
  );
}

export function seriesOverlapsRange(
  date: string,
  endDate: string | null,
  rangeFrom: string,
  rangeToExclusive: string,
): boolean {
  const last = endDate ?? date;
  return date < rangeToExclusive && last >= rangeFrom;
}

/** Skips on the start weekday inside `[date, endDate ?? date]`. Stale values drop. */
export function sanitizeSkippedDates(
  date: string,
  endDate: string | null,
  skippedDates: readonly string[],
): string[] {
  const last = endDate ?? date;
  const weekday = weekdayOf(date);
  return skippedDates.filter(
    (iso) => weekdayOf(iso) === weekday && iso >= date && iso <= last,
  );
}
