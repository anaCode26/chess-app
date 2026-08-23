"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Title } from "@components/ui/text";

export interface LoginCopy {
  heading: string;
  intro: string;
  email: string;
  password: string;
  submit: string;
  submitting: string;
  error: string;
}

export function LoginForm({
  copy,
  callbackUrl,
}: {
  copy: LoginCopy;
  callbackUrl: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError(null);
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(copy.error);
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } catch {
        setError(copy.error);
      }
    });
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
          />
        </Field>
        <Field label={copy.password} htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
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
