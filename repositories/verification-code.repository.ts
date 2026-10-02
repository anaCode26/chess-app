import type { VerificationPurpose } from "@prisma/client";
import { db } from "@lib/db";

export const verificationCodeRepository = {
  async findLatest(userId: string, purpose: VerificationPurpose) {
    return db.verificationCode.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });
  },

  async findOpen(userId: string, purpose: VerificationPurpose) {
    return db.verificationCode.findFirst({
      where: { userId, purpose, consumed: false },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Retires every open code for this user and purpose, then stores the new one.
   * One transaction, so a failed insert does not leave the account with no code.
   */
  async replaceOpen(data: {
    userId: string;
    purpose: VerificationPurpose;
    codeHash: string;
    expiresAt: Date;
  }) {
    return db.$transaction(async (tx) => {
      await tx.verificationCode.updateMany({
        where: { userId: data.userId, purpose: data.purpose, consumed: false },
        data: { consumed: true },
      });

      return tx.verificationCode.create({ data });
    });
  },

  async incrementAttempts(id: string) {
    return db.verificationCode.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  },

  async consume(id: string, maxAttempts: number) {
    const consumed = await db.verificationCode.updateMany({
      where: { id, consumed: false, attempts: { lt: maxAttempts } },
      data: { consumed: true },
    });

    return consumed.count === 1;
  },

  /** Consumes the code and activates the account together, or does neither. */
  async consumeAndActivate(
    codeId: string,
    userId: string,
    maxAttempts: number,
  ) {
    return db.$transaction(async (tx) => {
      const consumed = await tx.verificationCode.updateMany({
        where: { id: codeId, consumed: false, attempts: { lt: maxAttempts } },
        data: { consumed: true },
      });

      if (consumed.count !== 1) return false;

      await tx.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
      });

      return true;
    });
  },
};
