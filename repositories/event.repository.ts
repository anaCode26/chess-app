import { db } from "@lib/db";
import type { EventData } from "@actions/event/event.types";

function overlapsRange(from: Date, to: Date) {
  return {
    date: { lt: to },
    OR: [{ endDate: { gte: from } }, { AND: [{ endDate: null }, { date: { gte: from } }] }],
  };
}

export const eventRepository = {
  /** `to` is exclusive, matching `monthRange` in `lib/date/month.ts`. */
  async findPublishedInRange(from: Date, to: Date) {
    return db.event.findMany({
      where: { published: true, ...overlapsRange(from, to) },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  },

  /** Published series whose last night is still on or after `from`. */
  async findPublishedFrom(from: Date) {
    return db.event.findMany({
      where: {
        published: true,
        OR: [{ endDate: { gte: from } }, { AND: [{ endDate: null }, { date: { gte: from } }] }],
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  },

  async findInRange(from: Date, to: Date) {
    return db.event.findMany({
      where: overlapsRange(from, to),
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
    return db.event.create({
      data: {
        ...data,
        endDate: data.endDate ?? null,
        modifiedByUserId,
      },
    });
  },

  async update(id: string, data: EventData, modifiedByUserId: string) {
    return db.event.update({
      where: { id },
      data: {
        ...data,
        startTime: data.startTime ?? null,
        description: data.description ?? null,
        endDate: data.endDate ?? null,
        skippedDates: data.skippedDates,
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
