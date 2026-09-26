import { db } from "@lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } } },
    });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },

  async findPermissions(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        role: {
          select: {
            permissions: {
              select: { module: true, canRead: true, canWrite: true },
            },
          },
        },
      },
    });

    return user?.role.permissions ?? [];
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
