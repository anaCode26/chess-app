import { randomBytes } from "node:crypto";
import { db } from "@lib/db";

const EXPIRES_IN_MS = 72 * 60 * 60 * 1000;

export const invitationTokenRepository = {
  /** Replaces any earlier link for this address, so only the latest one works. */
  async create(email: string) {
    await db.userInvitationToken.deleteMany({ where: { email } });

    return db.userInvitationToken.create({
      data: {
        email,
        token: randomBytes(32).toString("hex"),
        expires: new Date(Date.now() + EXPIRES_IN_MS),
      },
    });
  },

  async findValid(token: string) {
    const record = await db.userInvitationToken.findUnique({
      where: { token },
    });
    if (!record) return null;

    if (record.expires < new Date()) {
      await db.userInvitationToken.delete({ where: { token } });
      return null;
    }

    return record;
  },

  async delete(token: string) {
    await db.userInvitationToken.deleteMany({ where: { token } });
  },
};
