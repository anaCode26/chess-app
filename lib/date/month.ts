import { CLUB_TIMEZONE } from "@lib/club-night";

/** A calendar month, with `month` 1-based so it matches the `YYYY-MM` URL param. */
export interface MonthKey {
  year: number;
  month: number;
}

export interface MonthCell {
  /** `YYYY-MM-DD`. */
  iso: string;
  day: number;
  /** A leading or trailing day borrowed from the adjacent month. */
  outside: boolean;
  isToday: boolean;
}

const MONTH_PARAM = /^(\d{4})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Noon UTC keeps a calendar date stable no matter which zone the server runs
 * in, and through Copenhagen's DST shifts. Same anchor as `lib/club-night.ts`.
 */
function anchor(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function toISODate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * For display. `new Date("2026-08-13")` is UTC midnight, which is the 12th once
 * a formatter renders it in Copenhagen; the noon anchor avoids that off-by-one.
 */
export function parseDateOnly(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return anchor(year, month, day);
}

/**
 * For storage, and deliberately a different anchor from `parseDateOnly`: Prisma
 * reads and writes a `@db.Date` column at UTC midnight, so writing noon would
 * put rows just outside the bounds `monthRange` queries with.
 */
export function toStoredDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Today as the club reckons it, which is not today in the server's zone. */
export function todayISO(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLUB_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function currentMonth(now: Date = new Date()): MonthKey {
  const [year, month] = todayISO(now).split("-").map(Number);
  return { year, month };
}

export function formatMonthParam({ year, month }: MonthKey): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function shiftMonth({ year, month }: MonthKey, delta: number): MonthKey {
  const zeroBased = month - 1 + delta;
  return {
    year: year + Math.floor(zeroBased / 12),
    month: ((zeroBased % 12) + 12) % 12 + 1,
  };
}

/** Falls back to the current club month for anything malformed or out of range. */
export function parseMonthParam(param: string | undefined, now: Date = new Date()): MonthKey {
  const match = param ? MONTH_PARAM.exec(param) : null;
  if (!match) return currentMonth(now);

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (year < 1900 || year > 2999 || month < 1 || month > 12) return currentMonth(now);

  return { year, month };
}

/**
 * Half-open UTC bounds for querying a `@db.Date` column, which Prisma reads and
 * writes at UTC midnight.
 */
export function monthRange({ year, month }: MonthKey): { from: Date; to: Date } {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
  };
}

/** The first of the month, for formatting a month-and-year heading. */
export function monthAnchor({ year, month }: MonthKey): Date {
  return anchor(year, month, 1);
}

/**
 * The 7-column grid for a month, Monday first as Denmark counts weeks, padded
 * with adjacent-month days to whole weeks.
 */
export function buildMonthCells(key: MonthKey, todayIso: string): MonthCell[] {
  const { year, month } = key;
  const first = anchor(year, month, 1);
  const mondayIndex = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const totalCells = Math.ceil((mondayIndex + daysInMonth) / 7) * 7;
  const start = first.getTime() - mondayIndex * DAY_MS;

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(start + index * DAY_MS);
    const iso = toISODate(date);

    return {
      iso,
      day: date.getUTCDate(),
      outside: date.getUTCMonth() !== month - 1,
      isToday: iso === todayIso,
    };
  });
}

/**
 * Monday-first weekday headers for the grid, taken from the active locale rather
 * than a hardcoded list so all three languages get their own abbreviations.
 */
export function weekdayAnchors(): Date[] {
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, index) => new Date(Date.UTC(2024, 0, 1 + index, 12)));
}
