"use client";

import { useState } from "react";
import { activateAccount } from "@actions/users/user.actions";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Title } from "@components/ui/text";

export interface ActivateCopy {
  heading: string;
  intro: string;
  password: string;
  confirm: string;
  passwordHint: string;
  submit: string;
  submitting: string;
  success: string;
  errors: {
    INVALID_TOKEN: string;
    INVALID_INPUT: string;
    generic: string;
  };
}

function messageFor(error: unknown, errors: ActivateCopy["errors"]): string {
  const code = error instanceof Error ? error.message : "";
  if (code in errors) return errors[code as keyof ActivateCopy["errors"]];
  return errors.generic;
}

export function ActivateForm({
  token,
  copy,
}: {
  token: string;
  copy: ActivateCopy;
}) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

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
      <form
        className="mt-10 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setError(null);
          setPending(true);
          void activateAccount({
            token,
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
          })
            .then(() => setDone(true))
            .catch((caught: unknown) =>
              setError(messageFor(caught, copy.errors)),
            )
            .finally(() => setPending(false));
        }}
      >
        <Field
          label={copy.password}
          htmlFor="password"
          hint={copy.passwordHint}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
        <Field label={copy.confirm} htmlFor="confirmPassword">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
        {error ? (
          <Body style={{ color: "var(--destructive)" }}>{error}</Body>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? copy.submitting : copy.submit}
        </Button>
      </form>
    </div>
  );
}
