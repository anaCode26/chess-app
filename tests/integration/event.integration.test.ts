import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEvent,
  deleteEvent,
  getPublishedEventsInMonth,
  getUpcomingEvents,
  updateEvent,
} from "@actions/event/event.actions";
import type { EventInput } from "@actions/event/event.types";
import { auth } from "@lib/auth/config";
import { db } from "@lib/db";
import { toISODate, toStoredDate } from "@lib/date/month";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@lib/auth/config", () => ({ auth: vi.fn() }));

const validInput: EventInput = {
  title: "Skakbowl",
  date: "2026-08-13",
  startTime: "19.00",
  published: true,
};

async function seedEvent(
  overrides: Partial<{
    title: string;
    date: string;
    startTime: string | null;
    description: string | null;
    published: boolean;
  }> = {},
) {
  return db.event.create({
    data: {
      title: overrides.title ?? "Skakbowl",
      date: toStoredDate(overrides.date ?? "2026-08-13"),
      startTime: overrides.startTime === undefined ? "19.00" : overrides.startTime,
      description: overrides.description ?? null,
      published: overrides.published ?? true,
    },
  });
}

beforeEach(async () => {
  await resetDb();
  const actor = await createTestActor();
  vi.mocked(auth).mockResolvedValue({
    user: { id: actor.id, name: actor.name, email: actor.email, role: actor.role },
  } as never);
});

describe("getPublishedEventsInMonth", () => {
  it("should return published events in the month when others sit outside it", async () => {
    await seedEvent({ title: "Skakbowl", date: "2026-08-13" });
    await seedEvent({ title: "Grand Prix Lyn Finale", date: "2026-09-03" });

    const events = await getPublishedEventsInMonth({ year: 2026, month: 8 });

    expect(events).toHaveLength(1);
    expect(events[0]?.title).toBe("Skakbowl");
    expect(events[0]?.date).toBe("2026-08-13");
  });

  it("should omit unpublished events when listing a public month", async () => {
    await seedEvent({ title: "Draft", date: "2026-08-13", published: false });
    await seedEvent({ title: "Grillaften", date: "2026-08-20", published: true });

    const events = await getPublishedEventsInMonth({ year: 2026, month: 8 });

    expect(events.map((event) => event.title)).toEqual(["Grillaften"]);
  });
});

describe("getUpcomingEvents", () => {
  it("should skip past days when listing upcoming events", async () => {
    await seedEvent({ title: "Yesterday", date: "2020-01-01" });
    await seedEvent({ title: "Later", date: "2099-12-01" });

    const events = await getUpcomingEvents(4);

    expect(events.map((event) => event.title)).toEqual(["Later"]);
  });
});

describe("createEvent", () => {
  it("should create an event when input is valid", async () => {
    await createEvent(validInput);

    const event = await db.event.findFirst({ where: { title: "Skakbowl" } });
    expect(event).not.toBeNull();
    expect(event && toISODate(event.date)).toBe("2026-08-13");
    expect(event?.startTime).toBe("19.00");
    expect(event?.published).toBe(true);
    expect(event?.modifiedByUserId).not.toBeNull();
  });

  it("should store description when provided", async () => {
    await createEvent({ ...validInput, description: "Lynskak i hallen." });

    const event = await db.event.findFirst({ where: { title: "Skakbowl" } });
    expect(event?.description).toBe("Lynskak i hallen.");
  });

  it("should throw when title is empty", async () => {
    await expect(createEvent({ ...validInput, title: "" })).rejects.toThrow(
      "A title is required",
    );
  });

  it("should throw when date format is invalid", async () => {
    await expect(createEvent({ ...validInput, date: "13/08/2026" })).rejects.toThrow(
      "Date must be YYYY-MM-DD",
    );
  });

  it("should throw when start time is not club notation", async () => {
    await expect(createEvent({ ...validInput, startTime: "19:00" })).rejects.toThrow(
      'Time must look like "19.00"',
    );
  });

  it("should throw when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    await expect(createEvent(validInput)).rejects.toThrow("Not authenticated.");
  });

  it("should throw when the actor is not an admin", async () => {
    const member = await createTestActor({
      email: "member@valbyskakklub.dk",
      role: "MEMBER",
    });
    vi.mocked(auth).mockResolvedValue({
      user: { id: member.id, name: member.name, email: member.email, role: member.role },
    } as never);

    await expect(createEvent(validInput)).rejects.toThrow("Not authorized.");
  });
});

describe("updateEvent", () => {
  it("should update title and time when input is valid", async () => {
    const event = await seedEvent();

    await updateEvent(event.id, {
      ...validInput,
      title: "Skakbowl finale",
      startTime: "18.00",
    });

    const updated = await db.event.findUnique({ where: { id: event.id } });
    expect(updated?.title).toBe("Skakbowl finale");
    expect(updated?.startTime).toBe("18.00");
  });

  it("should update date when changed", async () => {
    const event = await seedEvent();

    await updateEvent(event.id, { ...validInput, date: "2026-08-20" });

    const updated = await db.event.findUnique({ where: { id: event.id } });
    expect(updated && toISODate(updated.date)).toBe("2026-08-20");
  });

  it("should clear description when set to empty", async () => {
    const event = await seedEvent({ description: "Old text" });

    await updateEvent(event.id, { ...validInput, description: undefined });

    const updated = await db.event.findUnique({ where: { id: event.id } });
    expect(updated?.description).toBeNull();
  });

  it("should throw when title is empty", async () => {
    const event = await seedEvent();

    await expect(updateEvent(event.id, { ...validInput, title: "" })).rejects.toThrow(
      "A title is required",
    );
  });
});

describe("deleteEvent", () => {
  it("should remove the event when id is valid", async () => {
    const event = await seedEvent();

    await deleteEvent(event.id);

    const deleted = await db.event.findUnique({ where: { id: event.id } });
    expect(deleted).toBeNull();
  });

  it("should throw when not authenticated", async () => {
    const event = await seedEvent();
    vi.mocked(auth).mockResolvedValue(null as never);

    await expect(deleteEvent(event.id)).rejects.toThrow("Not authenticated.");
  });
});
