import { db } from "@lib/db";
import type { EventData } from "@actions/event/event.types";

export const eventRepository = {
  /** `to` is exclusive, matching `monthRange` in `lib/date/month.ts`. */
  async findPublishedInRange(from: Date, to: Date) {
    return db.event.findMany({
      where: { published: true, date: { gte: from, lt: to } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  },

  async findNextPublished(from: Date, limit: number) {
    return db.event.findMany({
      where: { published: true, date: { gte: from } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: limit,
    });
  },

  async findInRange(from: Date, to: Date) {
    return db.event.findMany({
      where: { date: { gte: from, lt: to } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  },

  async findAll() {
    return db.event.findMany({ orderBy: [{ date: "desc" }, { startTime: "asc" }] });
  },

  async findById(id: string) {
    return db.event.findUnique({ where: { id } });
  },

  async create(data: EventData, modifiedByUserId: string) {
    return db.event.create({ data: { ...data, modifiedByUserId } });
  },

  async update(id: string, data: EventData, modifiedByUserId: string) {
    return db.event.update({
      where: { id },
      data: {
        ...data,
        startTime: data.startTime ?? null,
        description: data.description ?? null,
        modifiedByUserId,
      },
    });
  },

  /**
   * Claims the right to announce this event, stamping `announcedAt` in the same
   * statement that tests it. Returns true for exactly one caller, so a retried
   * submit, a republish, or two admins at once can never send twice.
   */
  async claimAnnouncement(id: string) {
    const claimed = await db.event.updateMany({
      where: { id, published: true, announcedAt: null },
      data: { announcedAt: new Date() },
    });

    return claimed.count === 1;
  },

  async delete(id: string) {
    return db.event.delete({ where: { id } });
  },
};
