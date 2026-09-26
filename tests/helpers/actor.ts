import type { UserStatus } from "@prisma/client";
import { MODULES } from "@lib/constants/modules";
import { db } from "@lib/db";

type PermissionInput = {
  module: string;
  canRead: boolean;
  canWrite: boolean;
};

/** Full access to everything — what a test means when it says "an officer". */
const FULL_ACCESS: PermissionInput[] = MODULES.map((module) => ({
  module: module.key,
  canRead: true,
  canWrite: true,
}));

let roleCount = 0;

/**
 * A role with exactly the permissions given. Names are unique per call so a
 * test can hold several roles at once without colliding on `Role.name`.
 */
export async function createTestRole(permissions: PermissionInput[] = FULL_ACCESS) {
  roleCount += 1;

  return db.role.create({
    data: {
      name: `Test Role ${roleCount}`,
      permissions: { create: permissions },
    },
  });
}

/**
 * A user to act as. Pass `permissions: []` for someone with an account but no
 * backoffice access — a club member.
 */
export async function createTestActor(
  overrides: {
    name?: string;
    email?: string;
    permissions?: PermissionInput[];
    status?: UserStatus;
    passwordHash?: string;
    notifyOnNewEvent?: boolean;
  } = {},
) {
  const role = await createTestRole(overrides.permissions ?? FULL_ACCESS);

  return db.user.create({
    data: {
      name: overrides.name ?? "Test Actor",
      email: overrides.email ?? "actor@valbyskakklub.dk",
      passwordHash: overrides.passwordHash ?? "not-a-real-hash",
      status: overrides.status ?? "ACTIVE",
      roleId: role.id,
      notifyOnNewEvent: overrides.notifyOnNewEvent ?? true,
    },
  });
}
