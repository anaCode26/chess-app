import { vi } from "vitest";
import * as emailSenderModule from "@lib/email/email-sender.service";

/**
 * Replaces the real transport for a test. Call it in `beforeEach` and assert on
 * `mock.calls` to check what was (or was not) sent.
 */
export function mockSendEmail() {
  const mock = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(emailSenderModule, "sendEmail").mockImplementation(mock);

  return mock;
}
