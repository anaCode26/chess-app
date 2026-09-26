import bcrypt from "bcryptjs";
import { loginSchema } from "@actions/auth/auth.types";
import { userRepository } from "@repositories/user.repository";

export const authService = {
  /**
   * Proves identity, nothing more. A role that grants nothing still signs in
   * successfully and is turned away from `/backoffice` by the route guard —
   * keeping the two apart is what lets non-officers hold accounts at all.
   */
  async authorizeCredentials(credentials: unknown) {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const user = await userRepository.findByEmail(email);

    if (!user || !user.passwordHash || user.status !== "ACTIVE") return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions.map(({ module, canRead, canWrite }) => ({
        module,
        canRead,
        canWrite,
      })),
    };
  },
};
