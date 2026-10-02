"use client";

import { useState } from "react";
import {
  resendVerificationCode,
  verifyEmail,
} from "@actions/auth/auth.actions";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Title } from "@components/ui/text";

export interface VerifyCopy {
  heading: string;
  intro: string;
  email: string;
  code: string;
  submit: string;
  submitting: string;
  resend: string;
  resending: string;
  resent: string;
  success: string;
  errors: {
    INVALID_CODE: string;
    EXPIRED: string;
    EXHAUSTED: string;
    RATE_LIMITED: string;
    INVALID_INPUT: string;
    generic: string;
  };
}

function messageFor(error: unknown, copy: VerifyCopy["errors"]): string {
  const code = error instanceof Error ? error.message : "";
  if (code in copy && code !== "generic") {
    return copy[code as keyof Omit<VerifyCopy["errors"], "generic">];
  }
  return copy.generic;
}

export function VerifyForm({
  copy,
  email,
}: {
  copy: VerifyCopy;
  email: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState<"verify" | "resend" | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("email") ?? "");
    const code = String(formData.get("code") ?? "");

    setError(null);
    setNotice(null);
    setPending("verify");

    void verifyEmail({ email: submittedEmail, code })
      .then(() => {
        setDone(true);
      })
      .catch((caught: unknown) => {
        setError(messageFor(caught, copy.errors));
      })
      .finally(() => {
        setPending(null);
      });
  }

  function handleResend(form: HTMLFormElement) {
    const formData = new FormData(form);
    const submittedEmail = String(formData.get("email") ?? "");

    setError(null);
    setNotice(null);
    setPending("resend");

    void resendVerificationCode({ email: submittedEmail })
      .then(() => {
        setNotice(copy.resent);
      })
      .catch((caught: unknown) => {
        setError(messageFor(caught, copy.errors));
      })
      .finally(() => {
        setPending(null);
      });
  }

  if (done) {
    return (
      <div className="w-full max-w-sm">
        <Title as="h1" size="lg">
          {copy.heading}
        </Title>
        <Body className="mt-4">{copy.success}</Body>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Title as="h1" size="lg">
        {copy.heading}
      </Title>
      <Body className="mt-4">{copy.intro}</Body>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <Field label={copy.email} htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={email}
          />
        </Field>
        <Field label={copy.code} htmlFor="code">
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={6}
            pattern="[0-9]{6}"
          />
        </Field>
        {notice ? <Body>{notice}</Body> : null}
        {error ? (
          <Body style={{ color: "var(--destructive)" }}>{error}</Body>
        ) : null}
        <Button type="submit" disabled={pending !== null} className="w-full">
          {pending === "verify" ? copy.submitting : copy.submit}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending !== null}
          className="w-full"
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) handleResend(form);
          }}
        >
          {pending === "resend" ? copy.resending : copy.resend}
        </Button>
      </form>
    </div>
  );
}
