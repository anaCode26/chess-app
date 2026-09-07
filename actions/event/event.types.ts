import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { toISODate, toStoredDate } from "@lib/date/month";
import { includedDates, sanitizeSkippedDates } from "@lib/date/series";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** The club writes times as "19.00", not "19:00". */
const CLUB_TIME = /^([01]\d|2[0-3])\.[0-5]\d$/;

/** Treats a blank form field as absent rather than as an empty string. */
function blankToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const isoDateString = z.string().regex(ISO_DATE, "Date must be YYYY-MM-DD");

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "A title is required").max(100),
    date: isoDateString,
    endDate: z.preprocess(blankToUndefined, isoDateString.optional()),
    skippedDates: z.array(isoDateString).optional(),
    startTime: z.preprocess(
      blankToUndefined,
      z.string().trim().regex(CLUB_TIME, 'Time must look like "19.00"').optional(),
    ),
    description: z.preprocess(blankToUndefined, z.string().trim().max(500).optional()),
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.endDate && value.endDate < value.date) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after the start date.",
      });
    }

    const skipped = sanitizeSkippedDates(
      value.date,
      value.endDate ?? null,
      value.skippedDates ?? [],
    );
    if (includedDates(value.date, value.endDate ?? null, skipped).length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["skippedDates"],
        message: "At least one date must be included.",
      });
    }
  })
  .transform((value) => ({
    title: value.title,
    date: toStoredDate(value.date),
    endDate: value.endDate ? toStoredDate(value.endDate) : undefined,
    skippedDates: sanitizeSkippedDates(
      value.date,
      value.endDate ?? null,
      value.skippedDates ?? [],
    ),
    startTime: value.startTime,
    description: value.description,
    published: value.published,
  }));

export type EventInput = z.input<typeof eventSchema>;
export type EventData = z.output<typeof eventSchema>;

type EventRow = Prisma.EventGetPayload<object>;

/**
 * The shape that crosses into components. Dates are ISO strings because a
 * `Date` re-parsed in another zone can land on the wrong calendar day.
 */
export type SerializedEvent = Omit<
  EventRow,
  "date" | "endDate" | "createdAt" | "updatedAt" | "announcedAt"
> & {
  date: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  announcedAt: string | null;
};

export type EventOccurrence = SerializedEvent & {
  /** The calendar day this mark or list row represents. */
  occurrenceDate: string;
};

export function serializeEvent(event: EventRow): SerializedEvent {
  return {
    ...event,
    date: toISODate(event.date),
    endDate: event.endDate ? toISODate(event.endDate) : null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    announcedAt: event.announcedAt?.toISOString() ?? null,
  };
}
