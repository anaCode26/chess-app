"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@actions/auth/auth.actions";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Title } from "@components/ui/text";

export interface RegisterCopy {
  heading: string;
  intro: string;
  name: string;
  email: string;
  password: string;
  passwordHint: string;
  submit: string;
  submitting: string;
  errors: {
    EMAIL_TAKEN: string;
    NO_DEFAULT_ROLE: string;
    INVALID_INPUT: string;
    generic: string;
  };
}

function messageFor(error: unknown, copy: RegisterCopy["errors"]): string {
  const code = error instanceof Error ? error.message : "";
  if (code === "EMAIL_TAKEN") return copy.EMAIL_TAKEN;
  if (code === "NO_DEFAULT_ROLE") return copy.NO_DEFAULT_ROLE;
  if (code === "INVALID_INPUT") return copy.INVALID_INPUT;
  return copy.generic;
}

export function RegisterForm({ copy }: { copy: RegisterCopy }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError(null);
    setIsPending(true);

    void register({ name, email, password })
      .then(() => {
        router.push(
          `/register/verify?email=${encodeURIComponent(email.trim())}`,
        );
      })
      .catch((caught: unknown) => {
        setError(messageFor(caught, copy.errors));
        setIsPending(false);
      });
  }

  return (
    <div className="w-full max-w-sm">
      <Title as="h1" size="lg">
        {copy.heading}
      </Title>
      <Body className="mt-4">{copy.intro}</Body>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <Field label={copy.name} htmlFor="name">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
          />
        </Field>
        <Field label={copy.email} htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
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
        {error ? (
          <Body style={{ color: "var(--destructive)" }}>{error}</Body>
        ) : null}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? copy.submitting : copy.submit}
        </Button>
      </form>
    </div>
  );
}
