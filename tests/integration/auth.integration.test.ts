import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { authService } from "@lib/auth/auth.service";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";

const PASSWORD = "correct-horse";

beforeEach(async () => {
  await resetDb();
});

async function createAccount(
  overrides: Parameters<typeof createTestActor>[0] = {},
) {
  return createTestActor({
    email: "officer@valbyskakklub.dk",
    passwordHash: await bcrypt.hash(PASSWORD, 10),
    ...overrides,
  });
}

describe("authorizeCredentials", () => {
  it("should return the account with its permissions when an officer uses the right password", async () => {
    const officer = await createAccount({
      permissions: [{ module: "events", canRead: true, canWrite: true }],
    });

    const result = await authService.authorizeCredentials({
      email: officer.email,
      password: PASSWORD,
    });

    expect(result).toEqual({
      id: officer.id,
      name: officer.name,
      email: officer.email,
      roleId: officer.roleId,
      roleName: expect.any(String),
      permissions: [{ module: "events", canRead: true, canWrite: true }],
    });
  });

  it("should authenticate an account whose role grants nothing when the password is right", async () => {
    const account = await createAccount({ permissions: [] });

    const result = await authService.authorizeCredentials({
      email: account.email,
      password: PASSWORD,
    });

    // Signing in is identity; the route guard is what keeps them out.
    expect(result).toMatchObject({ id: account.id, permissions: [] });
  });

  it("should return null when the account is not active", async () => {
    const pending = await createAccount({ status: "PENDING" });

    const result = await authService.authorizeCredentials({
      email: pending.email,
      password: PASSWORD,
    });

    expect(result).toBeNull();
  });

  it("should return null when the password is wrong", async () => {
    const officer = await createAccount();

    const result = await authService.authorizeCredentials({
      email: officer.email,
      password: "wrong-password",
    });

    expect(result).toBeNull();
  });

  it("should return null when the email does not exist", async () => {
    const result = await authService.authorizeCredentials({
      email: "nobody@valbyskakklub.dk",
      password: PASSWORD,
    });

    expect(result).toBeNull();
  });
});
