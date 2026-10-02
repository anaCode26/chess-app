import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activateAccount,
  disableUser,
  inviteUser,
  resendInvitation,
} from "@actions/users/user.actions";
import {
  createRole,
  deleteRole,
  updateRole,
} from "@actions/roles/role.actions";
import { auth } from "@lib/auth/auth";
import { db } from "@lib/db";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";
import { mockSendEmail } from "@tests/helpers/mock-send-email";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@lib/auth/auth", () => ({ auth: vi.fn() }));

const EMAIL = "invited@valbyskakklub.dk";

let sendEmailMock: ReturnType<typeof mockSendEmail>;

beforeEach(async () => {
  await resetDb();
  sendEmailMock = mockSendEmail();
  vi.mocked(auth).mockResolvedValue(null as never);
});

async function signInOfficer() {
  const officer = await createTestActor({
    email: "officer@valbyskakklub.dk",
    permissions: [{ module: "users", canRead: true, canWrite: true }],
  });
  vi.mocked(auth).mockResolvedValue({ user: { id: officer.id } } as never);
  return officer;
}

function tokenFromEmail(): string {
  const html = String(sendEmailMock.mock.calls.at(-1)?.[0]?.html ?? "");
  const token = html.match(/token=([a-f0-9]+)/)?.[1];
  if (!token) throw new Error("Invitation email did not include a token.");
  return token;
}

describe("inviteUser and activateAccount", () => {
  it("should leave the account pending until the invitation link sets a password", async () => {
    const officer = await signInOfficer();
    const role = await db.role.create({ data: { name: "Player" } });

    await inviteUser({ name: "Newcomer", email: EMAIL, roleId: role.id });

    const pending = await db.user.findUnique({ where: { email: EMAIL } });
    expect(pending?.status).toBe("PENDING");
    expect(pending?.passwordHash).toBeNull();
    expect(pending?.roleId).toBe(role.id);
    expect(pending?.modifiedByUserId).toBe(officer.id);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);

    await activateAccount({
      token: tokenFromEmail(),
      password: "correct-horse",
      confirmPassword: "correct-horse",
    });

    const active = await db.user.findUnique({ where: { email: EMAIL } });
    expect(active?.status).toBe("ACTIVE");
    expect(
      await bcrypt.compare("correct-horse", active?.passwordHash ?? ""),
    ).toBe(true);
    await expect(
      activateAccount({
        token: tokenFromEmail(),
        password: "another-horse",
        confirmPassword: "another-horse",
      }),
    ).rejects.toThrow("INVALID_TOKEN");
  });

  it("should refuse an expired invitation link", async () => {
    await signInOfficer();
    const role = await db.role.create({ data: { name: "Player" } });
    await inviteUser({ name: "Newcomer", email: EMAIL, roleId: role.id });

    await db.userInvitationToken.updateMany({
      data: { expires: new Date(Date.now() - 60_000) },
    });

    await expect(
      activateAccount({
        token: tokenFromEmail(),
        password: "correct-horse",
        confirmPassword: "correct-horse",
      }),
    ).rejects.toThrow("INVALID_TOKEN");

    const stored = await db.user.findUnique({ where: { email: EMAIL } });
    expect(stored?.status).toBe("PENDING");
  });

  it("should refuse a second invitation link when the account is no longer pending", async () => {
    await signInOfficer();
    const role = await db.role.create({ data: { name: "Player" } });
    await inviteUser({ name: "Newcomer", email: EMAIL, roleId: role.id });

    await expect(resendInvitation("missing")).rejects.toThrow("NOT_FOUND");

    const pending = await db.user.findUniqueOrThrow({
      where: { email: EMAIL },
    });
    await disableUser(pending.id);
    await expect(resendInvitation(pending.id)).rejects.toThrow("NOT_PENDING");
  });
});

describe("role changes", () => {
  it("should refuse to change or delete a system role", async () => {
    await signInOfficer();
    const system = await db.role.create({
      data: { name: "Administrator", isSystem: true },
    });

    await expect(
      updateRole(system.id, {
        name: "Renamed",
        isDefault: false,
        permissions: [],
      }),
    ).rejects.toThrow("ROLE_SYSTEM");
    await expect(deleteRole(system.id)).rejects.toThrow("ROLE_SYSTEM");
  });

  it("should move the registration default and clear it when the role is unmarked", async () => {
    await signInOfficer();
    await createRole({ name: "Player", isDefault: true, permissions: [] });

    const first = await db.role.findUniqueOrThrow({
      where: { name: "Player" },
    });
    expect(first.isDefault).toBe(true);

    await createRole({ name: "Guest", isDefault: true, permissions: [] });
    const player = await db.role.findUniqueOrThrow({
      where: { name: "Player" },
    });
    const guest = await db.role.findUniqueOrThrow({ where: { name: "Guest" } });
    expect(player.isDefault).toBe(false);
    expect(guest.isDefault).toBe(true);

    await updateRole(guest.id, {
      name: "Guest",
      isDefault: false,
      permissions: [],
    });
    const unmarked = await db.role.findUniqueOrThrow({
      where: { name: "Guest" },
    });
    expect(unmarked.isDefault).toBe(false);
  });

  it("should refuse to delete a role that still has an account", async () => {
    await signInOfficer();
    const role = await db.role.create({ data: { name: "Player" } });
    await db.user.create({
      data: {
        name: "Player",
        email: "player@valbyskakklub.dk",
        roleId: role.id,
        status: "ACTIVE",
      },
    });

    await expect(deleteRole(role.id)).rejects.toThrow("ROLE_IN_USE");
  });
});
