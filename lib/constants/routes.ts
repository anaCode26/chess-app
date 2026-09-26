import { MODULES, type ModuleKey } from "./modules";

const ROUTE_TO_MODULE = new Map<string, ModuleKey>(
  MODULES.map((module) => [module.route, module.key]),
);

/**
 * The module a `/backoffice/...` path belongs to. Null for the dashboard root
 * and for any segment no module claims — callers must treat both as "no module
 * grants this", never as "no check needed".
 */
export function resolveModule(pathname: string): ModuleKey | null {
  const segment = /^\/backoffice\/([^/]+)/.exec(pathname)?.[1];

  return segment ? (ROUTE_TO_MODULE.get(segment) ?? null) : null;
}
