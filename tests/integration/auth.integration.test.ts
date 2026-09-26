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
  it("should return the account when an active admin uses the right password", async () => {
    const admin = await createAccount({ role: "ADMIN" });

    const result = await authService.authorizeCredentials({
      email: admin.email,
      password: PASSWORD,
    });

    expect(result).toEqual({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "ADMIN",
    });
  });

  it("should return null when the account is a member", async () => {
    const member = await createAccount({ role: "MEMBER" });

    const result = await authService.authorizeCredentials({
      email: member.email,
      password: PASSWORD,
    });

    expect(result).toBeNull();
  });

  it("should return null when the admin account is not active", async () => {
    const admin = await createAccount({ role: "ADMIN", status: "PENDING" });

    const result = await authService.authorizeCredentials({
      email: admin.email,
      password: PASSWORD,
    });

    expect(result).toBeNull();
  });

  it("should return null when the password is wrong", async () => {
    const admin = await createAccount({ role: "ADMIN" });

    const result = await authService.authorizeCredentials({
      email: admin.email,
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
