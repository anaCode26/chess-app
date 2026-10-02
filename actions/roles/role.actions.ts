"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { permissionService } from "@lib/auth/permission.service";
import { MODULES } from "@lib/constants/modules";
import { roleRepository } from "@repositories/role.repository";
import {
  roleFormSchema,
  type ManagedRole,
  type PermissionEntry,
  type RoleFormInput,
} from "./role.types";

function fail(code: string): never {
  throw new Error(code);
}

/** Write implies read. A module with neither flag is stored as no row. */
function grantedPermissions(permissions: PermissionEntry[]): PermissionEntry[] {
  const keys = new Set<string>(MODULES.map((module) => module.key));

  return permissions
    .filter((permission) => keys.has(permission.module))
    .map((permission) =>
      permission.canWrite ? { ...permission, canRead: true } : permission,
    )
    .filter((permission) => permission.canRead || permission.canWrite);
}

async function saveRole(
  input: RoleFormInput,
  actorId: string,
  roleId?: string,
) {
  const parsed = roleFormSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const data = {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    permissions: grantedPermissions(parsed.data.permissions),
    modifiedByUserId: actorId,
  };

  try {
    const saved = roleId
      ? await roleRepository.update(roleId, data)
      : await roleRepository.create(data);

    if (parsed.data.isDefault) await roleRepository.setDefault(saved.id);
    else if (saved.isDefault) await roleRepository.clearDefault(saved.id);
    return saved;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      fail("ROLE_NAME_TAKEN");
    }
    throw error;
  }
}

export async function getManagedRoles(): Promise<ManagedRole[]> {
  await permissionService.requireActorId("users", "read");
  const roles = await roleRepository.findAll();

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    isDefault: role.isDefault,
    userCount: role._count.users,
    permissions: role.permissions.map(({ module, canRead, canWrite }) => ({
      module,
      canRead,
      canWrite,
    })),
  }));
}

export async function createRole(input: RoleFormInput): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  await saveRole(input, actorId);
  revalidatePath("/backoffice/users");
}

export async function updateRole(
  id: string,
  input: RoleFormInput,
): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  const role = await roleRepository.findById(id);
  if (!role) fail("NOT_FOUND");
  if (role.isSystem) fail("ROLE_SYSTEM");

  await saveRole(input, actorId, id);
  revalidatePath("/backoffice/users");
}

export async function deleteRole(id: string): Promise<void> {
  await permissionService.requireActorId("users", "write");
  const role = await roleRepository.findById(id);
  if (!role) fail("NOT_FOUND");
  if (role.isSystem) fail("ROLE_SYSTEM");
  if (role._count.users > 0) fail("ROLE_IN_USE");

  await roleRepository.delete(id);
  revalidatePath("/backoffice/users");
}
