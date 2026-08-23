import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { Body } from "@components/ui/text";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("galleryPage");

  return { title: t("title"), description: t("description") };
}

export default async function GalleryPage() {
  const t = await getTranslations("galleryPage");

  return (
    <>
      <PageHeader title={t("heading")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <Body className="max-w-prose">{t("empty")}</Body>
      </div>
    </>
  );
}
