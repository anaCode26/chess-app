import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { RegisterForm } from "@components/features/auth/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("registerPage");

  return { title: t("title"), description: t("description") };
}

export default async function RegisterPage() {
  const t = await getTranslations("registerPage");

  return (
    <div className="flex flex-col items-center gap-10">
      <Link href="/" className="rounded-sm">
        <BrandMark />
      </Link>
      <RegisterForm
        copy={{
          heading: t("heading"),
          intro: t("intro"),
          name: t("name"),
          email: t("email"),
          password: t("password"),
          passwordHint: t("passwordHint"),
          submit: t("submit"),
          submitting: t("submitting"),
          errors: {
            EMAIL_TAKEN: t("errors.emailTaken"),
            NO_DEFAULT_ROLE: t("errors.unavailable"),
            INVALID_INPUT: t("errors.invalid"),
            generic: t("errors.generic"),
          },
        }}
      />
    </div>
  );
}
