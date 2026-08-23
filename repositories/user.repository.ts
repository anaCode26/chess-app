import { db } from "@lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },
};
