import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { LoginForm } from "@components/features/auth/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("loginPage");

  return { title: t("title"), description: t("description") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("loginPage");
  const safeCallback =
    callbackUrl?.startsWith("/backoffice") &&
    !callbackUrl.startsWith("/backoffice/login")
      ? callbackUrl
      : "/backoffice";

  return (
    <div className="flex flex-col items-center gap-10">
      <Link href="/" className="rounded-sm">
        <BrandMark />
      </Link>
      <LoginForm
        callbackUrl={safeCallback}
        copy={{
          heading: t("heading"),
          intro: t("intro"),
          email: t("email"),
          password: t("password"),
          submit: t("submit"),
          submitting: t("submitting"),
          error: t("error"),
        }}
      />
    </div>
  );
}
