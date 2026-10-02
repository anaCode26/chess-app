export const MODULES = [
  { key: "events", label: "Events", route: "events" },
  { key: "users", label: "Users", route: "users" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];
