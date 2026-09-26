import type { ModuleKey } from "@lib/constants/modules";
import { resolveModule } from "@lib/constants/routes";

/**
 * The permission shape carried in the session. Only the three fields the checks
 * read — the JWT travels in a cookie, so ids and timestamps would be weight.
 */
export type AccessPermission = {
  module: string;
  canRead: boolean;
  canWrite: boolean;
};

export type Access = "read" | "write";

/** A module with no row is denied, so a new module grants nothing until seeded. */
export function hasPermission(
  permissions: AccessPermission[],
  module: ModuleKey,
  access: Access,
): boolean {
  const permission = permissions.find((entry) => entry.module === module);
  if (!permission) return false;

  return access === "read" ? permission.canRead : permission.canWrite;
}

export function hasAnyReadableModule(permissions: AccessPermission[]): boolean {
  return permissions.some((permission) => permission.canRead);
}

/**
 * Whether a backoffice path is reachable. The dashboard is not a free lobby:
 * it opens only for someone who has a module to read, so an account with no
 * permissions has nothing behind `/backoffice` at all.
 *
 * `/backoffice/login` is not a module route and so resolves to false here —
 * `proxy.ts` handles it before asking.
 */
export function canAccessRoute(
  permissions: AccessPermission[],
  pathname: string,
): boolean {
  const moduleKey = resolveModule(pathname);
  if (moduleKey) return hasPermission(permissions, moduleKey, "read");

  const isDashboardRoot = pathname === "/backoffice" || pathname === "/backoffice/";

  return isDashboardRoot && hasAnyReadableModule(permissions);
}
