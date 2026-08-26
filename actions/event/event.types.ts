import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { toISODate, toStoredDate } from "@lib/date/month";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** The club writes times as "19.00", not "19:00". */
const CLUB_TIME = /^([01]\d|2[0-3])\.[0-5]\d$/;

/** Treats a blank form field as absent rather than as an empty string. */
function blankToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const eventSchema = z.object({
  title: z.string().trim().min(1, "A title is required").max(100),
  date: z
    .string()
    .regex(ISO_DATE, "Date must be YYYY-MM-DD")
    .transform(toStoredDate),
  startTime: z.preprocess(
    blankToUndefined,
    z.string().trim().regex(CLUB_TIME, 'Time must look like "19.00"').optional(),
  ),
  description: z.preprocess(blankToUndefined, z.string().trim().max(500).optional()),
  published: z.boolean(),
});

export type EventInput = z.input<typeof eventSchema>;
export type EventData = z.output<typeof eventSchema>;

type EventRow = Prisma.EventGetPayload<object>;

/**
 * The shape that crosses into components. `date` is an ISO string because a
 * `Date` re-parsed in another zone can land on the wrong calendar day.
 */
export type SerializedEvent = Omit<
  EventRow,
  "date" | "createdAt" | "updatedAt" | "announcedAt"
> & {
  date: string;
  createdAt: string;
  updatedAt: string;
  announcedAt: string | null;
};

export function serializeEvent(event: EventRow): SerializedEvent {
  return {
    ...event,
    date: toISODate(event.date),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    announcedAt: event.announcedAt?.toISOString() ?? null,
  };
}
