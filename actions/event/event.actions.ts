"use server";

import { revalidatePath } from "next/cache";
import type { Event as EventRow } from "@prisma/client";
import { permissionService } from "@lib/auth/permission.service";
import { monthRange, toISODate, toStoredDate, todayISO, type MonthKey } from "@lib/date/month";
import { nextIncludedDate } from "@lib/date/series";
import { eventNotificationService } from "@lib/notifications/event-notification.service";
import { eventRepository } from "@repositories/event.repository";
import {
  eventSchema,
  serializeEvent,
  type EventInput,
  type SerializedEvent,
} from "./event.types";

export async function getPublishedEventsInMonth(month: MonthKey): Promise<SerializedEvent[]> {
  const { from, to } = monthRange(month);
  const events = await eventRepository.findPublishedInRange(from, to);

  return events.map(serializeEvent);
}

export async function getUpcomingEvents(limit: number): Promise<SerializedEvent[]> {
  const today = todayISO();
  const events = await eventRepository.findPublishedFrom(toStoredDate(today));

  return events
    .map((event) => {
      const next = nextIncludedDate(
        toISODate(event.date),
        event.endDate ? toISODate(event.endDate) : null,
        event.skippedDates,
        today,
      );
      return next ? { event, next } : null;
    })
    .filter((entry): entry is { event: EventRow; next: string } => entry !== null)
    .sort((left, right) => {
      const byDate = left.next.localeCompare(right.next);
      if (byDate !== 0) return byDate;
      return (left.event.startTime ?? "").localeCompare(right.event.startTime ?? "");
    })
    .slice(0, limit)
    .map(({ event, next }) => ({ ...serializeEvent(event), date: next }));
}

export async function getManagedEventsInMonth(month: MonthKey): Promise<SerializedEvent[]> {
  await permissionService.requireActorId("events", "read");
  const { from, to } = monthRange(month);
  const events = await eventRepository.findInRange(from, to);

  return events.map(serializeEvent);
}

export async function createEvent(input: EventInput): Promise<SerializedEvent> {
  const data = parseEvent(input);
  const created = await eventRepository.create(data, await requireEventWriterId());
  revalidateEventPaths();
  await announceIfUnannounced(created);

  return serializeEvent(created);
}

export async function updateEvent(id: string, input: EventInput): Promise<SerializedEvent> {
  const data = parseEvent(input);
  const updated = await eventRepository.update(id, data, await requireEventWriterId());
  revalidateEventPaths();
  await announceIfUnannounced(updated);

  return serializeEvent(updated);
}

export async function deleteEvent(id: string): Promise<void> {
  await requireEventWriterId();
  await eventRepository.delete(id);
  revalidateEventPaths();
}

/**
 * One rule for every publish path — created published, draft then published, a
 * retried submit, an unpublish and republish. The claim is atomic, so only one
 * caller can ever win it.
 */
async function announceIfUnannounced(event: EventRow): Promise<void> {
  if (!event.published) return;
  if (!(await eventRepository.claimAnnouncement(event.id))) return;

  await eventNotificationService.announcePublished(event);
}

function parseEvent(input: EventInput) {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid event.");
  }

  return parsed.data;
}

function requireEventWriterId(): Promise<string> {
  return permissionService.requireActorId("events", "write");
}

function revalidateEventPaths() {
  revalidatePath("/calendar");
  revalidatePath("/");
  revalidatePath("/backoffice/events");
}
