import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { UnsubscribeForm } from "@components/features/notifications/unsubscribe-form";
import { Body } from "@components/ui/text";
import { verifyUnsubscribeToken } from "@lib/notifications/unsubscribe-token";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("unsubscribePage");

  return {
    title: t("title"),
    description: t("description"),
    // Reached only from a link in an email; there is nothing here to index.
    robots: { index: false, follow: false },
  };
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ token }, t] = await Promise.all([searchParams, getTranslations("unsubscribePage")]);
  const isValid = Boolean(token && verifyUnsubscribeToken(token));

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        {isValid && token ? (
          <UnsubscribeForm
            token={token}
            copy={{
              confirm: t("confirm"),
              submitting: t("submitting"),
              success: t("success"),
              error: t("error"),
            }}
          />
        ) : (
          <Body className="max-w-prose">{t("invalid")}</Body>
        )}
      </div>
    </>
  );
}
