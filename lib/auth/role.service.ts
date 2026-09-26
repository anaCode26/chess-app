import { MODULES } from "@lib/constants/modules";
import { roleRepository } from "@repositories/role.repository";

/** The seeded role. Every other role is created from the backoffice. */
export const ADMINISTRATOR_ROLE = "Administrator";

export const roleService = {
  /**
   * Idempotent, and the only definition of the seeded role — the seed script
   * and the tests both go through here. Permissions are derived from
   * `MODULES`, so a new module is granted by adding it there and re-seeding.
   */
  async ensureAdministratorRole() {
    return roleRepository.upsertSystemRole({
      name: ADMINISTRATOR_ROLE,
      description: "Full access to every backoffice module.",
      permissions: MODULES.map((module) => ({
        module: module.key,
        canRead: true,
        canWrite: true,
      })),
    });
  },
};
