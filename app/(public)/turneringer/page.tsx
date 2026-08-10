import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("tournamentsPage");

  return { title: t("title"), description: t("description") };
}

export default async function TournamentsPage() {
  const t = await getTranslations("tournamentsPage");

  const formats = [
    { id: "emt", heading: t("emtHeading"), body: t("emtBody") },
    { id: "blitz", heading: t("blitzHeading"), body: t("blitzBody") },
  ];

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <dl>
          {formats.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 border-b border-hairline py-9 first:border-t md:flex-row md:gap-16"
            >
              <dt className="font-display text-2xl uppercase leading-tight text-chalk md:w-80 md:shrink-0">
                {entry.heading}
              </dt>
              <dd className="max-w-prose leading-relaxed text-silver">{entry.body}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-prose leading-relaxed text-silver">
          {t("registerNote")}
        </p>
      </div>
    </>
  );
}
