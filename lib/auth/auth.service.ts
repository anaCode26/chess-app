import bcrypt from "bcryptjs";
import { loginSchema } from "@actions/auth/auth.types";
import { userRepository } from "@repositories/user.repository";

export const authService = {
  async authorizeCredentials(credentials: unknown) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const user = await userRepository.findByEmail(email);

    // Sign-in exists only to reach the backoffice, so members are never let in.
    if (!user || !user.passwordHash || user.status !== "ACTIVE") return null;
    if (user.role !== "ADMIN") return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
