import type { UserRole } from "@prisma/client";
import { db } from "@lib/db";

export async function createTestActor(
  overrides: { email?: string; role?: UserRole } = {},
) {
  return db.user.create({
    data: {
      name: "Test Actor",
      email: overrides.email ?? "actor@valbyskakklub.dk",
      passwordHash: "not-a-real-hash",
      status: "ACTIVE",
      role: overrides.role ?? "ADMIN",
    },
  });
}
