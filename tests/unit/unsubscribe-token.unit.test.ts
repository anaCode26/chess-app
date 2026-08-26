import { describe, expect, it } from "vitest";
import {
  signUnsubscribeToken,
  verifyUnsubscribeToken,
} from "@lib/notifications/unsubscribe-token";

describe("verifyUnsubscribeToken", () => {
  it("should return the user id when the token is untouched", () => {
    const token = signUnsubscribeToken("user_abc123");

    const result = verifyUnsubscribeToken(token);

    expect(result).toBe("user_abc123");
  });

  it("should return null when the signature is tampered with", () => {
    const token = signUnsubscribeToken("user_abc123");
    const [payload, signature] = token.split(".");
    const forged = `${payload}.${signature.slice(0, -1)}${signature.endsWith("a") ? "b" : "a"}`;

    const result = verifyUnsubscribeToken(forged);

    expect(result).toBeNull();
  });

  it("should return null when the payload is swapped for another user", () => {
    const token = signUnsubscribeToken("user_abc123");
    const signature = token.split(".")[1];
    const forged = `${Buffer.from("user_victim").toString("base64url")}.${signature}`;

    const result = verifyUnsubscribeToken(forged);

    expect(result).toBeNull();
  });

  it("should return null when the token has no separator", () => {
    const result = verifyUnsubscribeToken("not-a-token");

    expect(result).toBeNull();
  });

  it("should return null when the token is empty", () => {
    const result = verifyUnsubscribeToken("");

    expect(result).toBeNull();
  });
});
