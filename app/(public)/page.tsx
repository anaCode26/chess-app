import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ClubHero } from "@components/features/home/club-hero";
import { EventsRail } from "@components/features/home/events-rail";
import { getClubNightState } from "@lib/club-night";

/** The hall light and the live slot are read from the clock on every request. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return { title: { absolute: t("title") }, description: t("description") };
}

export default async function HomePage() {
  const state = getClubNightState();

  return (
    <>
      <ClubHero state={state} />
      <div className="border-t border-hairline">
        <EventsRail />
      </div>
    </>
  );
}
