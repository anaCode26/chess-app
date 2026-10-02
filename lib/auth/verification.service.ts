import { randomInt } from "node:crypto";
import type { VerificationPurpose } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verificationCodeRepository } from "@repositories/verification-code.repository";

const BCRYPT_COST = 10;

export const verificationPolicy = {
  codeLength: 6,
  ttlMs: 15 * 60 * 1000,
  maxAttempts: 5,
  resendCooldownMs: 60 * 1000,
} as const;

export type IssuedCode =
  { status: "issued"; code: string } | { status: "cooldown" };

function generateCode(): string {
  const ceiling = 10 ** verificationPolicy.codeLength;

  return randomInt(0, ceiling)
    .toString()
    .padStart(verificationPolicy.codeLength, "0");
}

function fail(code: "INVALID_CODE" | "EXPIRED" | "EXHAUSTED"): never {
  throw new Error(code);
}

export const verificationService = {
  /**
   * Stores a new code for the user. A request inside the cooldown keeps the
   * previous code and reports `cooldown` so the caller can stay quiet.
   */
  async issue(
    userId: string,
    purpose: VerificationPurpose,
  ): Promise<IssuedCode> {
    const latest = await verificationCodeRepository.findLatest(userId, purpose);
    const elapsed = latest ? Date.now() - latest.createdAt.getTime() : Infinity;

    if (elapsed < verificationPolicy.resendCooldownMs) {
      return { status: "cooldown" };
    }

    const code = generateCode();
    await verificationCodeRepository.replaceOpen({
      userId,
      purpose,
      codeHash: await bcrypt.hash(code, BCRYPT_COST),
      expiresAt: new Date(Date.now() + verificationPolicy.ttlMs),
    });

    return { status: "issued", code };
  },

  /**
   * Checks the open code for this purpose. A match on email verification
   * activates the account. Any other purpose only consumes the code.
   */
  async redeem(
    userId: string,
    purpose: VerificationPurpose,
    code: string,
  ): Promise<void> {
    const row = await verificationCodeRepository.findOpen(userId, purpose);
    if (!row) fail("INVALID_CODE");
    if (row.expiresAt.getTime() <= Date.now()) fail("EXPIRED");
    if (row.attempts >= verificationPolicy.maxAttempts) fail("EXHAUSTED");

    const matches = await bcrypt.compare(code, row.codeHash);
    if (!matches) {
      const updated = await verificationCodeRepository.incrementAttempts(
        row.id,
      );
      if (updated.attempts >= verificationPolicy.maxAttempts) fail("EXHAUSTED");
      fail("INVALID_CODE");
    }

    const consumed =
      purpose === "EMAIL_VERIFICATION"
        ? await verificationCodeRepository.consumeAndActivate(
            row.id,
            userId,
            verificationPolicy.maxAttempts,
          )
        : await verificationCodeRepository.consume(
            row.id,
            verificationPolicy.maxAttempts,
          );

    if (!consumed) fail("INVALID_CODE");
  },
};
