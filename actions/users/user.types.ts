import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());

export const inviteUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: emailField,
  roleId: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  roleId: z.string().min(1),
});

export const activateAccountSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).max(200),
    confirmPassword: z.string().min(1),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
  });

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ActivateAccountInput = z.infer<typeof activateAccountSchema>;

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  roleId: string;
  roleName: string;
};
