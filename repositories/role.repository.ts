import { db } from "@lib/db";

type PermissionInput = {
  module: string;
  canRead: boolean;
  canWrite: boolean;
};

const roleInclude = {
  permissions: { orderBy: { module: "asc" as const } },
  _count: { select: { users: true } },
};

export const roleRepository = {
  async findAll() {
    return db.role.findMany({
      include: roleInclude,
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    });
  },

  async findById(id: string) {
    return db.role.findUnique({ where: { id }, include: roleInclude });
  },

  async create(data: {
    name: string;
    description?: string | null;
    permissions: PermissionInput[];
    modifiedByUserId: string;
  }) {
    return db.role.create({
      data: {
        name: data.name,
        description: data.description,
        modifiedByUserId: data.modifiedByUserId,
        permissions: { create: data.permissions },
      },
      include: roleInclude,
    });
  },

  async update(
    id: string,
    data: {
      name: string;
      description?: string | null;
      permissions: PermissionInput[];
      modifiedByUserId: string;
    },
  ) {
    return db.$transaction(async (tx) => {
      await tx.permission.deleteMany({ where: { roleId: id } });

      return tx.role.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          modifiedByUserId: data.modifiedByUserId,
          permissions: { create: data.permissions },
        },
        include: roleInclude,
      });
    });
  },

  async delete(id: string) {
    return db.role.delete({ where: { id } });
  },

  async findDefault() {
    return db.role.findFirst({ where: { isDefault: true } });
  },

  /**
   * Marks one role as the registration default and clears the flag on every
   * other row, so two roles can never both be default.
   */
  async setDefault(roleId: string) {
    return db.$transaction(async (tx) => {
      await tx.role.updateMany({
        where: { isDefault: true, id: { not: roleId } },
        data: { isDefault: false },
      });

      return tx.role.update({
        where: { id: roleId },
        data: { isDefault: true },
      });
    });
  },

  async clearDefault(roleId: string) {
    return db.role.updateMany({
      where: { id: roleId, isDefault: true },
      data: { isDefault: false },
    });
  },

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
      create: {
        name: data.name,
        description: data.description,
        isSystem: true,
      },
    });

    await db.permission.deleteMany({
      where: {
        roleId: role.id,
        module: {
          notIn: data.permissions.map((permission) => permission.module),
        },
      },
    });

    for (const permission of data.permissions) {
      await db.permission.upsert({
        where: {
          roleId_module: { roleId: role.id, module: permission.module },
        },
        update: { canRead: permission.canRead, canWrite: permission.canWrite },
        create: { roleId: role.id, ...permission },
      });
    }

    return role;
  },
};
