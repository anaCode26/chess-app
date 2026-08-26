import { db } from "@lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },

  async findEventNotificationRecipients() {
    return db.user.findMany({
      where: { status: "ACTIVE", notifyOnNewEvent: true },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async disableEventNotifications(id: string) {
    return db.user.update({
      where: { id },
      data: { notifyOnNewEvent: false },
    });
  },
};
