"use server";

import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { permissionService } from "@lib/auth/permission.service";
import { sendEmail } from "@lib/email/email-sender.service";
import { UserInvitationEmail } from "@lib/email/templates/user-invitation-email";
import { env } from "@lib/env";
import { invitationTokenRepository } from "@repositories/invitation-token.repository";
import { userRepository } from "@repositories/user.repository";
import {
  activateAccountSchema,
  inviteUserSchema,
  updateUserSchema,
  type ActivateAccountInput,
  type InviteUserInput,
  type ManagedUser,
  type UpdateUserInput,
} from "./user.types";

const INVITE_SUBJECT = "Aktivér din konto hos Valby Skakklub";
const BCRYPT_COST = 10;

function fail(code: string): never {
  throw new Error(code);
}

async function deliverInvitation(user: { name: string; email: string }) {
  const tokenRecord = await invitationTokenRepository.create(user.email);
  const activationUrl = `${env.NEXTAUTH_URL}/activate?token=${tokenRecord.token}`;
  const html = await render(
    UserInvitationEmail({ name: user.name, activationUrl }),
  );

  await sendEmail({ to: user.email, subject: INVITE_SUBJECT, html });
}

export async function getManagedUsers(): Promise<ManagedUser[]> {
  await permissionService.requireActorId("users", "read");
  const users = await userRepository.findAll();

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    roleId: user.roleId,
    roleName: user.role.name,
  }));
}

export async function inviteUser(input: InviteUserInput): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  const parsed = inviteUserSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const existing = await userRepository.findByEmail(parsed.data.email);
  if (existing) fail("EMAIL_TAKEN");

  const created = await userRepository.createInvited({
    ...parsed.data,
    modifiedByUserId: actorId,
  });
  await deliverInvitation(created);
  revalidatePath("/backoffice/users");
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const user = await userRepository.findById(id);
  if (!user) fail("NOT_FOUND");

  await userRepository.update(id, {
    ...parsed.data,
    modifiedByUserId: actorId,
  });
  revalidatePath("/backoffice/users");
}

export async function disableUser(id: string): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  const user = await userRepository.findById(id);
  if (!user) fail("NOT_FOUND");

  await userRepository.update(id, {
    status: "INACTIVE",
    modifiedByUserId: actorId,
  });
  revalidatePath("/backoffice/users");
}

export async function enableUser(id: string): Promise<void> {
  const actorId = await permissionService.requireActorId("users", "write");
  const user = await userRepository.findById(id);
  if (!user) fail("NOT_FOUND");

  await userRepository.update(id, {
    status: "ACTIVE",
    modifiedByUserId: actorId,
  });
  revalidatePath("/backoffice/users");
}

export async function resendInvitation(id: string): Promise<void> {
  await permissionService.requireActorId("users", "write");
  const user = await userRepository.findById(id);
  if (!user) fail("NOT_FOUND");
  if (user.status !== "PENDING") fail("NOT_PENDING");

  await deliverInvitation(user);
  revalidatePath("/backoffice/users");
}

export async function invitationIsValid(token: string): Promise<boolean> {
  if (!token) return false;

  const record = await invitationTokenRepository.findValid(token);
  return record !== null;
}

export async function activateAccount(
  input: ActivateAccountInput,
): Promise<void> {
  const parsed = activateAccountSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const record = await invitationTokenRepository.findValid(parsed.data.token);
  if (!record) fail("INVALID_TOKEN");

  const user = await userRepository.findByEmail(record.email);
  if (!user || user.status !== "PENDING") fail("INVALID_TOKEN");

  await userRepository.activate(
    record.email,
    await bcrypt.hash(parsed.data.password, BCRYPT_COST),
  );
  await invitationTokenRepository.delete(parsed.data.token);
}
