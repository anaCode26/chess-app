import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { ActivateForm } from "@components/features/auth/activate-form";
import { Body, Title } from "@components/ui/text";
import { invitationIsValid } from "@actions/users/user.actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("activatePage");

  return { title: t("title"), description: t("description") };
}

export default async function ActivatePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const t = await getTranslations("activatePage");
  const valid = token ? await invitationIsValid(token) : false;

  return (
    <div className="flex flex-col items-center gap-10">
      <Link href="/" className="rounded-sm">
        <BrandMark />
      </Link>
      {token && valid ? (
        <ActivateForm
          token={token}
          copy={{
            heading: t("heading"),
            intro: t("intro"),
            password: t("password"),
            confirm: t("confirm"),
            passwordHint: t("passwordHint"),
            submit: t("submit"),
            submitting: t("submitting"),
            success: t("success"),
            errors: {
              INVALID_TOKEN: t("errors.invalidToken"),
              INVALID_INPUT: t("errors.invalid"),
              generic: t("errors.generic"),
            },
          }}
        />
      ) : (
        <div className="w-full max-w-sm">
          <Title as="h1" size="lg">
            {t("heading")}
          </Title>
          <Body className="mt-4">{t("invalid")}</Body>
        </div>
      )}
    </div>
  );
}
