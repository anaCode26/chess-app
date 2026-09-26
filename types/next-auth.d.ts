export {};

import type { AccessPermission } from "@lib/auth/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      roleId: string;
      roleName: string;
      permissions: AccessPermission[];
    };
  }

  interface User {
    id: string;
    roleId: string;
    roleName: string;
    permissions: AccessPermission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId: string;
    roleName: string;
    permissions: AccessPermission[];
  }
}
