import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "@lib/auth/auth";
import { permissionService } from "@lib/auth/permission.service";
import { ADMINISTRATOR_ROLE, roleService } from "@lib/auth/role.service";
import { MODULES } from "@lib/constants/modules";
import { db } from "@lib/db";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";

vi.mock("@lib/auth/auth", () => ({ auth: vi.fn() }));

function signIn(id: string) {
  vi.mocked(auth).mockResolvedValue({ user: { id } } as never);
}

beforeEach(async () => {
  await resetDb();
  vi.mocked(auth).mockResolvedValue(null as never);
});

describe("requireActorId", () => {
  it("should return the actor id when the role grants the access", async () => {
    const actor = await createTestActor({
      permissions: [{ module: "events", canRead: true, canWrite: true }],
    });
    signIn(actor.id);

    const id = await permissionService.requireActorId("events", "write");

    expect(id).toBe(actor.id);
  });

  it("should throw when the role grants read but the action needs write", async () => {
    const actor = await createTestActor({
      permissions: [{ module: "events", canRead: true, canWrite: false }],
    });
    signIn(actor.id);

    await expect(
      permissionService.requireActorId("events", "write"),
    ).rejects.toThrow("Not authorized.");
  });

  it("should throw when the role has no row for the module", async () => {
    const actor = await createTestActor({ permissions: [] });
    signIn(actor.id);

    await expect(
      permissionService.requireActorId("events", "read"),
    ).rejects.toThrow("Not authorized.");
  });

  it("should throw when there is no session", async () => {
    await expect(
      permissionService.requireActorId("events", "read"),
    ).rejects.toThrow("Not authenticated.");
  });

  it("should refuse once the permission is revoked, without a new sign-in", async () => {
    const actor = await createTestActor({
      permissions: [{ module: "events", canRead: true, canWrite: true }],
    });
    signIn(actor.id);
    await permissionService.requireActorId("events", "write");

    await db.permission.updateMany({
      where: { roleId: actor.roleId, module: "events" },
      data: { canWrite: false },
    });

    await expect(
      permissionService.requireActorId("events", "write"),
    ).rejects.toThrow("Not authorized.");
  });
});

describe("can", () => {
  it("should be false when there is no session", async () => {
    await expect(permissionService.can("events", "read")).resolves.toBe(false);
  });

  it("should be true when the role grants the access", async () => {
    const actor = await createTestActor();
    signIn(actor.id);

    await expect(permissionService.can("events", "read")).resolves.toBe(true);
  });
});

describe("ensureAdministratorRole", () => {
  it("should give the administrator write access to every module", async () => {
    await roleService.ensureAdministratorRole();

    const administrator = await db.role.findUniqueOrThrow({
      where: { name: ADMINISTRATOR_ROLE },
      include: { permissions: true },
    });

    expect(administrator.isSystem).toBe(true);
    expect(administrator.permissions).toHaveLength(MODULES.length);
    expect(
      administrator.permissions.every(
        (permission) => permission.canRead && permission.canWrite,
      ),
    ).toBe(true);
  });

  it("should leave the same rows behind when run twice", async () => {
    const first = await roleService.ensureAdministratorRole();
    await roleService.ensureAdministratorRole();

    const roles = await db.role.findMany();
    const permissions = await db.permission.findMany();

    expect(roles).toHaveLength(1);
    expect(roles[0]?.id).toBe(first.id);
    expect(permissions).toHaveLength(MODULES.length);
  });

  it("should restore a permission that was tampered with", async () => {
    const administrator = await roleService.ensureAdministratorRole();
    await db.permission.updateMany({
      where: { roleId: administrator.id },
      data: { canWrite: false },
    });

    await roleService.ensureAdministratorRole();

    const permissions = await db.permission.findMany({
      where: { roleId: administrator.id },
    });
    expect(permissions.every((permission) => permission.canWrite)).toBe(true);
  });
});
