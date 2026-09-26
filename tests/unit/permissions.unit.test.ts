import { describe, expect, it } from "vitest";
import {
  canAccessRoute,
  hasAnyReadableModule,
  hasPermission,
  type AccessPermission,
} from "@lib/auth/permissions";
import { resolveModule } from "@lib/constants/routes";

const READ_ONLY: AccessPermission[] = [
  { module: "events", canRead: true, canWrite: false },
];

const NONE: AccessPermission[] = [];

describe("resolveModule", () => {
  it("should return the module when the segment belongs to one", () => {
    expect(resolveModule("/backoffice/events")).toBe("events");
  });

  it("should return the module when the path goes deeper than the segment", () => {
    expect(resolveModule("/backoffice/events/abc123/edit")).toBe("events");
  });

  it("should return null when no module claims the segment", () => {
    expect(resolveModule("/backoffice/tournaments")).toBeNull();
  });

  it("should return null when the path is the dashboard root", () => {
    expect(resolveModule("/backoffice")).toBeNull();
  });
});

describe("hasPermission", () => {
  it("should allow reading when the module grants read", () => {
    expect(hasPermission(READ_ONLY, "events", "read")).toBe(true);
  });

  it("should refuse writing when the module grants read only", () => {
    expect(hasPermission(READ_ONLY, "events", "write")).toBe(false);
  });

  it("should refuse when the module has no row at all", () => {
    expect(hasPermission(NONE, "events", "read")).toBe(false);
  });
});

describe("hasAnyReadableModule", () => {
  it("should be true when at least one module is readable", () => {
    expect(hasAnyReadableModule(READ_ONLY)).toBe(true);
  });

  it("should be false when every module is write-only or absent", () => {
    expect(
      hasAnyReadableModule([{ module: "events", canRead: false, canWrite: true }]),
    ).toBe(false);
  });
});

describe("canAccessRoute", () => {
  it("should allow a module route when the module is readable", () => {
    expect(canAccessRoute(READ_ONLY, "/backoffice/events")).toBe(true);
  });

  it("should refuse a module route when the module is not readable", () => {
    expect(canAccessRoute(NONE, "/backoffice/events")).toBe(false);
  });

  it("should allow the dashboard when something is readable", () => {
    expect(canAccessRoute(READ_ONLY, "/backoffice")).toBe(true);
  });

  it("should refuse the dashboard when nothing is readable", () => {
    expect(canAccessRoute(NONE, "/backoffice")).toBe(false);
  });

  it("should refuse a segment no module claims", () => {
    expect(canAccessRoute(READ_ONLY, "/backoffice/tournaments")).toBe(false);
  });

  it("should refuse the login path, which the guard handles before asking", () => {
    expect(canAccessRoute(READ_ONLY, "/backoffice/login")).toBe(false);
  });
});
