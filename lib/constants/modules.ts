export const MODULES = [
  { key: "events", label: "Events", route: "events" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];
