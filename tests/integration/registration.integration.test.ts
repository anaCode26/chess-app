import { beforeEach, describe, expect, it, vi } from "vitest";
import { register, verifyEmail } from "@actions/auth/auth.actions";
import { db } from "@lib/db";
import { resetDb } from "@tests/helpers/db";
import { mockSendEmail } from "@tests/helpers/mock-send-email";

vi.mock("@lib/auth/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: {},
}));

const EMAIL = "newcomer@valbyskakklub.dk";
const PASSWORD = "correct-horse";

let sendEmailMock: ReturnType<typeof mockSendEmail>;
let roleCount = 0;

beforeEach(async () => {
  await resetDb();
  sendEmailMock = mockSendEmail();
  roleCount = 0;
});

async function seedDefaultRole() {
  roleCount += 1;

  return db.role.create({
    data: { name: `Default role ${roleCount}`, isDefault: true },
  });
}

function codeFromEmail(): string {
  const html = String(sendEmailMock.mock.calls.at(-1)?.[0]?.html ?? "");
  const match = html.match(/>\s*(\d{6})\s*</);
  if (!match?.[1])
    throw new Error("Verification email did not include a code.");

  return match[1];
}

describe("register and verifyEmail", () => {
  it("should activate the account on the default role when the emailed code is entered", async () => {
    const role = await seedDefaultRole();

    await register({ name: "Newcomer", email: EMAIL, password: PASSWORD });

    const pending = await db.user.findUnique({ where: { email: EMAIL } });
    expect(pending?.status).toBe("PENDING");
    expect(pending?.roleId).toBe(role.id);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);

    const code = codeFromEmail();
    await verifyEmail({ email: EMAIL, code });

    const active = await db.user.findUnique({ where: { email: EMAIL } });
    const storedCode = await db.verificationCode.findFirst({
      where: { userId: pending?.id },
    });
    expect(active?.status).toBe("ACTIVE");
    expect(storedCode?.consumed).toBe(true);

    await expect(verifyEmail({ email: EMAIL, code })).rejects.toThrow(
      "INVALID_CODE",
    );
  });

  it("should leave the account pending when the code has expired", async () => {
    await seedDefaultRole();
    await register({ name: "Newcomer", email: EMAIL, password: PASSWORD });

    const pending = await db.user.findUniqueOrThrow({
      where: { email: EMAIL },
    });
    await db.verificationCode.updateMany({
      where: { userId: pending.id },
      data: { expiresAt: new Date(Date.now() - 60_000) },
    });

    await expect(
      verifyEmail({ email: EMAIL, code: codeFromEmail() }),
    ).rejects.toThrow("EXPIRED");

    const stored = await db.user.findUnique({ where: { email: EMAIL } });
    expect(stored?.status).toBe("PENDING");
  });

  it("should refuse the right code after five wrong attempts", async () => {
    await seedDefaultRole();
    await register({ name: "Newcomer", email: EMAIL, password: PASSWORD });

    const code = codeFromEmail();
    const wrong = code === "000000" ? "111111" : "000000";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        verifyEmail({ email: EMAIL, code: wrong }),
      ).rejects.toThrow();
    }

    await expect(verifyEmail({ email: EMAIL, code })).rejects.toThrow(
      "EXHAUSTED",
    );

    const stored = await db.user.findUnique({ where: { email: EMAIL } });
    expect(stored?.status).toBe("PENDING");
  });
});
