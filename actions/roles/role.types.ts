import { z } from "zod";

export const permissionEntrySchema = z.object({
  module: z.string().min(1),
  canRead: z.boolean(),
  canWrite: z.boolean(),
});

export const roleFormSchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().max(200).optional(),
  isDefault: z.boolean(),
  permissions: z.array(permissionEntrySchema),
});

export type RoleFormInput = z.infer<typeof roleFormSchema>;
export type PermissionEntry = z.infer<typeof permissionEntrySchema>;

export type ManagedRole = {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  isDefault: boolean;
  userCount: number;
  permissions: PermissionEntry[];
};
