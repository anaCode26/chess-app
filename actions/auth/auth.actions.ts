"use server";

import { render } from "@react-email/render";
import bcrypt from "bcryptjs";
import { signOut } from "@lib/auth/auth";
import {
  verificationPolicy,
  verificationService,
} from "@lib/auth/verification.service";
import { sendEmail } from "@lib/email/email-sender.service";
import { VerificationCodeEmail } from "@lib/email/templates/verification-code-email";
import { roleRepository } from "@repositories/role.repository";
import { userRepository } from "@repositories/user.repository";
import {
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  type RegisterInput,
  type ResendVerificationInput,
  type VerifyEmailInput,
} from "./auth.types";

const CODE_SUBJECT = "Din kode til Valby Skakklub";
const BCRYPT_COST = 10;

function fail(code: string): never {
  throw new Error(code);
}

async function deliverCode(
  user: { name: string; email: string },
  code: string,
) {
  const html = await render(
    VerificationCodeEmail({
      name: user.name,
      code,
      ttlMinutes: verificationPolicy.ttlMs / 60_000,
    }),
  );

  await sendEmail({ to: user.email, subject: CODE_SUBJECT, html });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function register(input: RegisterInput): Promise<void> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const { name, email, password } = parsed.data;
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.status !== "PENDING") fail("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const user = existing
    ? await userRepository.updateCredentials(existing.id, {
        name,
        passwordHash,
      })
    : await createPending(name, email, passwordHash);

  const issued = await verificationService.issue(user.id, "EMAIL_VERIFICATION");
  if (issued.status === "cooldown") return;

  await deliverCode(user, issued.code);
}

async function createPending(
  name: string,
  email: string,
  passwordHash: string,
) {
  const role = await roleRepository.findDefault();
  if (!role) fail("NO_DEFAULT_ROLE");

  return userRepository.create({
    name,
    email,
    passwordHash,
    roleId: role.id,
    status: "PENDING",
  });
}

export async function verifyEmail(input: VerifyEmailInput): Promise<void> {
  const parsed = verifyEmailSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const { email, code } = parsed.data;
  const user = await userRepository.findByEmail(email);
  if (!user || user.status !== "PENDING") fail("INVALID_CODE");

  await verificationService.redeem(user.id, "EMAIL_VERIFICATION", code);
}

export async function resendVerificationCode(
  input: ResendVerificationInput,
): Promise<void> {
  const parsed = resendVerificationSchema.safeParse(input);
  if (!parsed.success) fail("INVALID_INPUT");

  const user = await userRepository.findByEmail(parsed.data.email);
  if (!user || user.status !== "PENDING") return;

  const issued = await verificationService.issue(user.id, "EMAIL_VERIFICATION");
  if (issued.status === "cooldown") fail("RATE_LIMITED");

  await deliverCode(user, issued.code);
}
