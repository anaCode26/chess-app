import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { VerifyForm } from "@components/features/auth/verify-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("verifyPage");

  return { title: t("title"), description: t("description") };
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const t = await getTranslations("verifyPage");

  return (
    <div className="flex flex-col items-center gap-10">
      <Link href="/" className="rounded-sm">
        <BrandMark />
      </Link>
      <VerifyForm
        email={email ?? ""}
        copy={{
          heading: t("heading"),
          intro: t("intro"),
          email: t("email"),
          code: t("code"),
          submit: t("submit"),
          submitting: t("submitting"),
          resend: t("resend"),
          resending: t("resending"),
          resent: t("resent"),
          success: t("success"),
          errors: {
            INVALID_CODE: t("errors.invalidCode"),
            EXPIRED: t("errors.expired"),
            EXHAUSTED: t("errors.exhausted"),
            RATE_LIMITED: t("errors.rateLimited"),
            INVALID_INPUT: t("errors.invalid"),
            generic: t("errors.generic"),
          },
        }}
      />
    </div>
  );
}
