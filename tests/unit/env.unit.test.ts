import { describe, expect, it } from "vitest";
import { envSchema } from "@lib/env";

describe("envSchema", () => {
  it("parses a valid environment", () => {
    const parsed = envSchema.parse({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/test",
      NEXTAUTH_SECRET: "test-secret-that-is-at-least-32-chars-long!!",
      NEXTAUTH_URL: "http://localhost:3000",
      S3_ACCESS_KEY: "key",
      S3_SECRET_KEY: "secret",
      S3_BUCKET: "bucket",
      SMTP_HOST: "localhost",
      SMTP_PORT: "1025",
      SMTP_USER: "user",
      SMTP_PASS: "pass",
    });

    expect(parsed.S3_REGION).toBe("auto");
    expect(parsed.APP_VERSION).toBe("dev");
  });
});
