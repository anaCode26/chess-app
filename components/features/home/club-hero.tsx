import { getTranslations } from "next-intl/server";
import { ActionLink } from "@components/common/action-link";
import { Body, Caption, Display } from "@components/ui/text";
import type { ClubNightState } from "@lib/club-night";
import { ClubWindow } from "./club-window";

export async function ClubHero({ state }: { state: ClubNightState }) {
  const t = await getTranslations("home");

  return (
    <section
      id="klubaften"
      aria-labelledby="klubaften-titel"
      className="@container relative isolate w-full scroll-mt-24 bg-ground"
    >
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-16 md:py-20 lg:gap-20">
        <div>
          <Display id="klubaften-titel">{t("headline")}</Display>

          <Body className="mt-5 max-w-xl">{t("lede")}</Body>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href="/calendar">{t("primaryCta")}</ActionLink>
            <ActionLink href="/contact#bliv-medlem" variant="ghost">
              {t("secondaryCta")}
            </ActionLink>
          </div>

          <Caption className="mt-8">{t("address")}</Caption>
        </div>

        <ClubWindow state={state} />
      </div>
    </section>
  );
}
