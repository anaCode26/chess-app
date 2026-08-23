import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Body, Title } from "@components/ui/text";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("backoffice");

  return { title: t("dashboard") };
}

export default async function BackofficePage() {
  const t = await getTranslations("backoffice");

  return (
    <div className="space-y-4">
      <Title as="h1" size="lg">
        {t("dashboard")}
      </Title>
      <Body className="max-w-prose">{t("dashboardIntro")}</Body>
    </div>
  );
}
