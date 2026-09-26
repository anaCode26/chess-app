import type { ModuleKey } from "@lib/constants/modules";
import { userRepository } from "@repositories/user.repository";
import { auth } from "./auth";
import { hasPermission, type Access, type AccessPermission } from "./permissions";

/**
 * Permissions are read from the database rather than from the session, so
 * revoking one takes effect on the next request instead of the next login.
 * The session snapshot is for `proxy.ts`, which cannot reach the database.
 */
async function actor(): Promise<{ id: string; permissions: AccessPermission[] } | null> {
  const session = await auth();
  if (!session?.user.id) return null;

  return {
    id: session.user.id,
    permissions: await userRepository.findPermissions(session.user.id),
  };
}

export const permissionService = {
  /** For Server Components deciding what to render. */
  async can(module: ModuleKey, access: Access): Promise<boolean> {
    const current = await actor();

    return current ? hasPermission(current.permissions, module, access) : false;
  },

  /** For actions: the caller's id, or a throw. */
  async requireActorId(module: ModuleKey, access: Access): Promise<string> {
    const current = await actor();
    if (!current) throw new Error("Not authenticated.");
    if (!hasPermission(current.permissions, module, access)) {
      throw new Error("Not authorized.");
    }

    return current.id;
  },
};
