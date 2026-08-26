import type { UserRole, UserStatus } from "@prisma/client";
import { db } from "@lib/db";

export async function createTestActor(
  overrides: {
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    notifyOnNewEvent?: boolean;
  } = {},
) {
  return db.user.create({
    data: {
      name: overrides.name ?? "Test Actor",
      email: overrides.email ?? "actor@valbyskakklub.dk",
      passwordHash: "not-a-real-hash",
      status: overrides.status ?? "ACTIVE",
      role: overrides.role ?? "ADMIN",
      notifyOnNewEvent: overrides.notifyOnNewEvent ?? true,
    },
  });
}
