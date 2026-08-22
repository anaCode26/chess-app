import { getTranslations } from "next-intl/server";
import { ActionLink } from "@components/common/action-link";
import type { ClubNightState } from "@lib/club-night";
import { ClubWindow } from "./club-window";

/**
 * Daylit klubaften stage: no street illustration. Copy and the live schedule
 * window sit side by side on the pale ground; amber still marks the lit hall.
 */
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
          <h1
            id="klubaften-titel"
            className="text-balance font-display text-[clamp(2.5rem,11vw,3.75rem)] uppercase leading-[0.92] tracking-[-0.01em] text-chalk md:text-[clamp(2.75rem,4.2vw,4.25rem)]"
          >
            {t("headline")}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-silver">
            {t("lede")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href="/kalender">{t("primaryCta")}</ActionLink>
            <ActionLink href="/kontakt#bliv-medlem" variant="ghost">
              {t("secondaryCta")}
            </ActionLink>
          </div>

          <p className="mt-8 text-sm text-silver">{t("address")}</p>
        </div>

        <ClubWindow state={state} />
      </div>
    </section>
  );
}
