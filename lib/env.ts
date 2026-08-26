import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default("auto"),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  /**
   * A display-name form ("Valby Skakklub <...>"), which `z.email()` rejects.
   * Deliberately has no default: a plausible-but-wrong sender shipping quietly
   * is worse than failing at boot.
   */
  EMAIL_FROM: z.string().min(1),
  APP_VERSION: z.string().default("dev"),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
