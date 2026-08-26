import { beforeEach, describe, expect, it } from "vitest";
import { unsubscribeFromEventEmails } from "@actions/notifications/notification.actions";
import { db } from "@lib/db";
import { signUnsubscribeToken } from "@lib/notifications/unsubscribe-token";
import { createTestActor } from "@tests/helpers/actor";
import { resetDb } from "@tests/helpers/db";

beforeEach(async () => {
  await resetDb();
});

describe("unsubscribeFromEventEmails", () => {
  it("should clear the preference when the token is valid", async () => {
    const member = await createTestActor({
      email: "anna@valbyskakklub.dk",
      role: "MEMBER",
      notifyOnNewEvent: true,
    });

    await unsubscribeFromEventEmails(signUnsubscribeToken(member.id));

    const stored = await db.user.findUnique({ where: { id: member.id } });
    expect(stored?.notifyOnNewEvent).toBe(false);
  });

  it("should stay unsubscribed when the same link is clicked twice", async () => {
    const member = await createTestActor({ email: "anna@valbyskakklub.dk", role: "MEMBER" });
    const token = signUnsubscribeToken(member.id);

    await unsubscribeFromEventEmails(token);
    await unsubscribeFromEventEmails(token);

    const stored = await db.user.findUnique({ where: { id: member.id } });
    expect(stored?.notifyOnNewEvent).toBe(false);
  });

  it("should leave other members untouched when one unsubscribes", async () => {
    const anna = await createTestActor({ email: "anna@valbyskakklub.dk", role: "MEMBER" });
    const bo = await createTestActor({ email: "bo@valbyskakklub.dk", role: "MEMBER" });

    await unsubscribeFromEventEmails(signUnsubscribeToken(anna.id));

    const stored = await db.user.findUnique({ where: { id: bo.id } });
    expect(stored?.notifyOnNewEvent).toBe(true);
  });

  it("should throw when the token is tampered with", async () => {
    const member = await createTestActor({ email: "anna@valbyskakklub.dk", role: "MEMBER" });
    const forged = `${signUnsubscribeToken(member.id).split(".")[0]}.wrong-signature`;

    await expect(unsubscribeFromEventEmails(forged)).rejects.toThrow("Invalid unsubscribe link.");
  });

  it("should throw when the token is empty", async () => {
    await expect(unsubscribeFromEventEmails("")).rejects.toThrow("A token is required");
  });

  it("should throw when the user no longer exists", async () => {
    const token = signUnsubscribeToken("user_that_never_existed");

    await expect(unsubscribeFromEventEmails(token)).rejects.toThrow("Invalid unsubscribe link.");
  });
});
