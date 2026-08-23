"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@lib/auth/config";
import { canManageEvents } from "@lib/auth/permissions";
import { monthRange, toStoredDate, todayISO, type MonthKey } from "@lib/date/month";
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
  const events = await eventRepository.findNextPublished(toStoredDate(todayISO()), limit);

  return events.map(serializeEvent);
}

export async function getManagedEventsInMonth(month: MonthKey): Promise<SerializedEvent[]> {
  await requireAdminId();
  const { from, to } = monthRange(month);
  const events = await eventRepository.findInRange(from, to);

  return events.map(serializeEvent);
}

export async function createEvent(input: EventInput): Promise<SerializedEvent> {
  const data = parseEvent(input);
  const created = await eventRepository.create(data, await requireAdminId());
  revalidateEventPaths();

  return serializeEvent(created);
}

export async function updateEvent(id: string, input: EventInput): Promise<SerializedEvent> {
  const data = parseEvent(input);
  const updated = await eventRepository.update(id, data, await requireAdminId());
  revalidateEventPaths();

  return serializeEvent(updated);
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdminId();
  await eventRepository.delete(id);
  revalidateEventPaths();
}

function parseEvent(input: EventInput) {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid event.");
  }

  return parsed.data;
}

async function requireAdminId(): Promise<string> {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Not authenticated.");
  }
  if (!canManageEvents(session)) {
    throw new Error("Not authorized.");
  }

  return session.user.id;
}

function revalidateEventPaths() {
  revalidatePath("/calendar");
  revalidatePath("/");
  revalidatePath("/backoffice/events");
}
