import nodemailer from "nodemailer";
import { env } from "@lib/env";

/**
 * Pooled and created once: announcing an event fans out to the whole
 * membership, and an unpooled transport would open a connection per member.
 */
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  pool: true,
  maxConnections: 5,
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export async function sendEmail({ to, subject, html, headers }: SendEmailOptions) {
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html, headers });
}
