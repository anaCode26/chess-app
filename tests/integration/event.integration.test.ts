import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UserStatus } from "@prisma/client";
import {
  createEvent,
  deleteEvent,
  getPublishedEventsInMonth,
  getUpcomingEvents,
  updateEvent,
} from "@actions/event/event.actions";
import type { EventInput } from "@actions/event/event.types";
import { expandOccurrencesInMonth } from "@components/features/calendar/group-events";
import { auth } from "@lib/auth/auth";
import { db } from "@lib/db";
import { toISODate, toStoredDate } from "@lib/date/month";
import { verifyUnsubscribeToken } from "@lib/notifications/unsubscribe-token";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";
import { mockSendEmail } from "@tests/helpers/mock-send-email";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@lib/auth/auth", () => ({ auth: vi.fn() }));

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
    endDate: string | null;
    skippedDates: string[];
    startTime: string | null;
    description: string | null;
    published: boolean;
    announcedAt: Date | null;
  }> = {},
) {
  return db.event.create({
    data: {
      title: overrides.title ?? "Skakbowl",
      date: toStoredDate(overrides.date ?? "2026-08-13"),
      endDate: overrides.endDate ? toStoredDate(overrides.endDate) : null,
      skippedDates: overrides.skippedDates ?? [],
      startTime: overrides.startTime === undefined ? "19.00" : overrides.startTime,
      description: overrides.description ?? null,
      published: overrides.published ?? true,
      announcedAt: overrides.announcedAt ?? null,
    },
  });
}

function seedMember(
  email: string,
  overrides: Partial<{ status: UserStatus; notifyOnNewEvent: boolean }> = {},
) {
  return createTestActor({
    name: "Medlem",
    email,
    permissions: [],
    status: overrides.status ?? "ACTIVE",
    notifyOnNewEvent: overrides.notifyOnNewEvent ?? true,
  });
}

/** Recipients of the last announcement, in the order they were sent. */
function recipientsOf(mock: ReturnType<typeof mockSendEmail>): string[] {
  return mock.mock.calls.map((call) => (call[0] as { to: string }).to);
}

let sendEmailMock: ReturnType<typeof mockSendEmail>;

beforeEach(async () => {
  await resetDb();
  sendEmailMock = mockSendEmail();

  // Opted out so each test states its own recipients; one test below opts the
  // admin back in to prove they are treated like any other member.
  // Only the id: the actions read permissions from the database, not the session.
  const actor = await createTestActor({ notifyOnNewEvent: false });
  vi.mocked(auth).mockResolvedValue({ user: { id: actor.id } } as never);
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

  it("should throw when the actor may read events but not write them", async () => {
    const reader = await createTestActor({
      email: "reader@valbyskakklub.dk",
      permissions: [{ module: "events", canRead: true, canWrite: false }],
    });
    vi.mocked(auth).mockResolvedValue({ user: { id: reader.id } } as never);

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

describe("event announcements", () => {
  it("should email every active member when an event is created published", async () => {
    await seedMember("anna@valbyskakklub.dk");
    await seedMember("bo@valbyskakklub.dk");

    await createEvent(validInput);

    expect(recipientsOf(sendEmailMock).sort()).toEqual([
      "anna@valbyskakklub.dk",
      "bo@valbyskakklub.dk",
    ]);
  });

  it("should email members when a draft is published", async () => {
    await seedMember("anna@valbyskakklub.dk");
    const event = await seedEvent({ published: false });

    await updateEvent(event.id, { ...validInput, published: true });

    expect(recipientsOf(sendEmailMock)).toEqual(["anna@valbyskakklub.dk"]);
  });

  it("should not email when an already announced event is edited", async () => {
    await seedMember("anna@valbyskakklub.dk");
    const event = await seedEvent({ published: true, announcedAt: new Date() });

    await updateEvent(event.id, { ...validInput, title: "Skakbowl finale" });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should not email when the event is saved as a draft", async () => {
    await seedMember("anna@valbyskakklub.dk");

    await createEvent({ ...validInput, published: false });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should not email again when an event is unpublished and published once more", async () => {
    await seedMember("anna@valbyskakklub.dk");
    const event = await seedEvent({ published: false });

    await updateEvent(event.id, { ...validInput, published: true });
    await updateEvent(event.id, { ...validInput, published: false });
    await updateEvent(event.id, { ...validInput, published: true });

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
  });

  it("should skip members when their account is not active", async () => {
    await seedMember("pending@valbyskakklub.dk", { status: "PENDING" });
    await seedMember("inactive@valbyskakklub.dk", { status: "INACTIVE" });

    await createEvent(validInput);

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should skip members when they have opted out", async () => {
    await seedMember("anna@valbyskakklub.dk", { notifyOnNewEvent: false });
    await seedMember("bo@valbyskakklub.dk");

    await createEvent(validInput);

    expect(recipientsOf(sendEmailMock)).toEqual(["bo@valbyskakklub.dk"]);
  });

  it("should email the admin when they have not opted out", async () => {
    const admin = await db.user.findUniqueOrThrow({
      where: { email: "actor@valbyskakklub.dk" },
    });
    await db.user.update({ where: { id: admin.id }, data: { notifyOnNewEvent: true } });

    await createEvent(validInput);

    expect(recipientsOf(sendEmailMock)).toEqual([admin.email]);
  });

  it("should stamp announcedAt when the announcement is claimed", async () => {
    const created = await createEvent(validInput);

    const stored = await db.event.findUnique({ where: { id: created.id } });
    expect(stored?.announcedAt).not.toBeNull();
  });

  it("should carry the event link and a personal unsubscribe link when sending", async () => {
    const member = await seedMember("anna@valbyskakklub.dk");
    const created = await createEvent({ ...validInput, description: "Lynskak i hallen." });

    const message = sendEmailMock.mock.calls[0][0] as {
      subject: string;
      html: string;
      headers: Record<string, string>;
    };

    expect(message.subject).toBe("Nyt arrangement i klubben: Skakbowl");
    expect(message.html).toContain(`/calendar?month=2026-08#event-${created.id}`);
    expect(message.html).toContain("/unsubscribe?token=");
    expect(message.html).toContain("Lynskak i hallen.");
    expect(message.headers["List-Unsubscribe"]).toContain("/unsubscribe?token=");

    // The token is the member's own, not a shared one.
    const token = /unsubscribe\?token=([^"&]+)/.exec(message.html)?.[1];
    expect(verifyUnsubscribeToken(decodeURIComponent(token ?? ""))).toBe(member.id);
  });

  it("should still create the event when sending fails", async () => {
    await seedMember("anna@valbyskakklub.dk");
    sendEmailMock.mockRejectedValue(new Error("SMTP is down"));

    await expect(createEvent(validInput)).resolves.toMatchObject({ title: "Skakbowl" });

    const stored = await db.event.findFirst({ where: { title: "Skakbowl" } });
    expect(stored?.published).toBe(true);
  });

  it("should list every included Thursday once when a series is published", async () => {
    await seedMember("anna@valbyskakklub.dk");

    await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-08-27",
    });

    const html = (sendEmailMock.mock.calls[0][0] as { html: string }).html;
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(html).toContain("13.");
    expect(html).toContain("20.");
    expect(html).toContain("27.");
  });
});

describe("event Thursday series", () => {
  it("should store the range when an officer saves from Thursday to Thursday", async () => {
    await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-09-03",
    });

    const stored = await db.event.findFirst({ where: { title: "Skakbowl" } });
    expect(stored && toISODate(stored.date)).toBe("2026-08-13");
    expect(stored?.endDate && toISODate(stored.endDate)).toBe("2026-09-03");
    expect(stored?.skippedDates).toEqual([]);
  });

  it("should return the series in every overlapped month when it crosses a boundary", async () => {
    await createEvent({
      ...validInput,
      title: "Valbymesterskabet",
      date: "2026-10-29",
      endDate: "2026-11-12",
    });

    const october = await getPublishedEventsInMonth({ year: 2026, month: 10 });
    const november = await getPublishedEventsInMonth({ year: 2026, month: 11 });

    expect(october).toHaveLength(1);
    expect(november).toHaveLength(1);
    expect(expandOccurrencesInMonth(october, { year: 2026, month: 10 })).toHaveLength(1);
    expect(expandOccurrencesInMonth(november, { year: 2026, month: 11 })).toHaveLength(2);
  });

  it("should omit a skipped Thursday from the month list when it is deselected", async () => {
    await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-08-27",
      skippedDates: ["2026-08-20"],
    });

    const month = await getPublishedEventsInMonth({ year: 2026, month: 8 });
    const days = expandOccurrencesInMonth(month, { year: 2026, month: 8 }).map(
      (event) => event.occurrenceDate,
    );

    expect(days).toEqual(["2026-08-13", "2026-08-27"]);
  });

  it("should return three occurrences when three included Thursdays fall in one month", async () => {
    await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-08-27",
    });

    const month = await getPublishedEventsInMonth({ year: 2026, month: 8 });
    expect(expandOccurrencesInMonth(month, { year: 2026, month: 8 })).toHaveLength(3);
  });

  it("should return a series once when listing upcoming events", async () => {
    await createEvent({
      ...validInput,
      title: "Lang turnering",
      date: "2099-01-01",
      endDate: "2099-02-12",
    });
    await createEvent({
      ...validInput,
      title: "Grillaften",
      date: "2099-03-05",
    });

    const upcoming = await getUpcomingEvents(4);

    expect(upcoming.map((event) => event.title)).toEqual(["Lang turnering", "Grillaften"]);
    expect(upcoming[0]?.date).toBe("2099-01-01");
  });

  it("should throw when the end date is before the start date", async () => {
    await expect(
      createEvent({ ...validInput, date: "2026-08-20", endDate: "2026-08-13" }),
    ).rejects.toThrow("End date must be on or after the start date.");
  });

  it("should repeat on the start date's weekday when that is not Thursday", async () => {
    await createEvent({
      ...validInput,
      title: "Onsdagslyn",
      date: "2026-08-12",
      endDate: "2026-08-26",
    });

    const month = await getPublishedEventsInMonth({ year: 2026, month: 8 });
    expect(
      expandOccurrencesInMonth(month, { year: 2026, month: 8 }).map((event) => event.occurrenceDate),
    ).toEqual(["2026-08-12", "2026-08-19", "2026-08-26"]);
  });

  it("should keep the start weekday when the end date falls on another weekday", async () => {
    await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-08-15",
    });

    const month = await getPublishedEventsInMonth({ year: 2026, month: 8 });
    expect(
      expandOccurrencesInMonth(month, { year: 2026, month: 8 }).map((event) => event.occurrenceDate),
    ).toEqual(["2026-08-13"]);
  });

  it("should drop a skip outside the range when the window is saved", async () => {
    const created = await createEvent({
      ...validInput,
      date: "2026-08-13",
      endDate: "2026-08-20",
      skippedDates: ["2026-08-27"],
    });

    expect(created.skippedDates).toEqual([]);
  });
});
