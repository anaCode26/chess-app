import type { Session } from "next-auth";

export function canManageEvents(session: Session | null | undefined): boolean {
  return session?.user.role === "ADMIN";
}
