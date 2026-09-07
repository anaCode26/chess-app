import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { ActionLink } from "@components/common/action-link";
import { PageHeader } from "@components/common/page-header";
import { RatingList } from "@components/features/ratings/rating-list";
import { Caption } from "@components/ui/text";
import { club } from "@lib/content/club";
import { sampleRatings } from "@lib/content/ratings-sample";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ratingsPage");

  return { title: t("title"), description: t("description") };
}

export default async function RatingsPage() {
  const [t, format] = await Promise.all([
    getTranslations("ratingsPage"),
    getFormatter(),
  ]);

  const elo = (value: number) => format.number(value, { useGrouping: false });
  const rows = sampleRatings.map((player, index) => ({
    id: player.id,
    name: player.name,
    rank: elo(index + 1),
    rating: elo(player.rating),
    rapid: elo(player.rapid),
    blitz: elo(player.blitz),
    fide: player.fide === null ? t("unrated") : elo(player.fide),
  }));

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <ActionLink
          href={club.dsu.clubUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t("official")}
        </ActionLink>

        <div className="mt-14">
          <RatingList
            rows={rows}
            copy={{
              rank: t("rank"),
              player: t("player"),
              rating: t("rating"),
              rapid: t("rapid"),
              blitz: t("blitz"),
              fide: t("fide"),
            }}
          />
        </div>

        <Caption className="mt-10 max-w-prose">{t("sampleNote")}</Caption>
      </div>
    </>
  );
}
