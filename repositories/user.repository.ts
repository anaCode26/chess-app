import type { UserStatus } from "@prisma/client";
import { db } from "@lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } } },
    });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id }, include: { role: true } });
  },

  async findAll() {
    return db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });
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

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
    status: UserStatus;
  }) {
    return db.user.create({ data });
  },

  /** An officer-created account. No password until the invitation is accepted. */
  async createInvited(data: {
    name: string;
    email: string;
    roleId: string;
    modifiedByUserId: string;
  }) {
    return db.user.create({
      data: { ...data, status: "PENDING" },
      include: { role: true },
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      roleId?: string;
      status?: UserStatus;
      modifiedByUserId: string;
    },
  ) {
    return db.user.update({ where: { id }, data, include: { role: true } });
  },

  async activate(email: string, passwordHash: string) {
    return db.user.update({
      where: { email },
      data: { passwordHash, status: "ACTIVE" },
    });
  },

  async updateCredentials(
    id: string,
    data: { name: string; passwordHash: string },
  ) {
    return db.user.update({ where: { id }, data });
  },
};
