import { db } from "@lib/db";

type PermissionInput = {
  module: string;
  canRead: boolean;
  canWrite: boolean;
};

export const roleRepository = {
  /**
   * Upserts a seeded role and makes its permissions match `permissions`
   * exactly, so re-running the seed after a module is added or dropped leaves
   * no stale rows behind.
   */
  async upsertSystemRole(data: {
    name: string;
    description: string;
    permissions: PermissionInput[];
  }) {
    const role = await db.role.upsert({
      where: { name: data.name },
      update: { description: data.description, isSystem: true },
      create: { name: data.name, description: data.description, isSystem: true },
    });

    await db.permission.deleteMany({
      where: {
        roleId: role.id,
        module: { notIn: data.permissions.map((permission) => permission.module) },
      },
    });

    for (const permission of data.permissions) {
      await db.permission.upsert({
        where: { roleId_module: { roleId: role.id, module: permission.module } },
        update: { canRead: permission.canRead, canWrite: permission.canWrite },
        create: { roleId: role.id, ...permission },
      });
    }

    return role;
  },
};
