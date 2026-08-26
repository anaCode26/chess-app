"use client";

import { useState, useTransition } from "react";
import { unsubscribeFromEventEmails } from "@actions/notifications/notification.actions";
import { Button } from "@components/ui/button";
import { Body } from "@components/ui/text";

export interface UnsubscribeCopy {
  confirm: string;
  submitting: string;
  success: string;
  error: string;
}

/**
 * A button rather than an opt-out on page load: mail scanners prefetch links,
 * and a GET that mutates would unsubscribe people who never clicked.
 */
export function UnsubscribeForm({ token, copy }: { token: string; copy: UnsubscribeCopy }) {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  if (status === "done") {
    return <Body className="max-w-prose">{copy.success}</Body>;
  }

  function handleClick() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await unsubscribeFromEventEmails(token);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="max-w-prose">
      <Button onClick={handleClick} disabled={isPending}>
        {isPending ? copy.submitting : copy.confirm}
      </Button>
      {status === "error" ? (
        <Body style={{ color: "var(--destructive)" }} className="mt-5">
          {copy.error}
        </Body>
      ) : null}
    </div>
  );
}
