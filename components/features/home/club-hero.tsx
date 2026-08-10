import { getTranslations } from "next-intl/server";
import { ActionLink } from "@components/common/action-link";
import type { ClubNightState, NightPhase } from "@lib/club-night";
import { ClubWindow } from "./club-window";

/**
 * The stage never crops: the artwork fills a fixed ratio box, so every point in
 * the picture keeps a stable percentage coordinate and the window stays on the
 * wall at any width. The illustration carries the street, the building and the
 * rain; every scrap of the club's own light is drawn here in CSS so it can be
 * switched off outside club night.
 */
const PHASE_WASH: Record<NightPhase, string> = {
  day: "bg-silver/12",
  dusk: "bg-bluehour/25",
  night: "bg-ground/35",
  dawn: "bg-silver/8",
};

const SPILL =
  "radial-gradient(55% 70% at 50% 0%, color-mix(in srgb, var(--amber) 45%, transparent) 0%, transparent 72%)";

export async function ClubHero({ state }: { state: ClubNightState }) {
  const t = await getTranslations("home");

  return (
    <section className="@container relative isolate w-full overflow-hidden bg-ground">
      <div className="relative aspect-[2/3] w-full md:aspect-[16/9]">
        <picture>
          <source media="(min-width: 768px)" srcSet="/scene/street.webp" />
          {/* Two compositions rather than one crop: next/image cannot switch sources. */}
          <img
            src="/scene/street-portrait.webp"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        <div aria-hidden className={`absolute inset-0 ${PHASE_WASH[state.phase]}`} />

        {state.isLit ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-[4%] top-[62%] h-[36%] w-[92%] md:left-[44%] md:top-[64%] md:h-[34%] md:w-[54%]"
            style={{ background: SPILL, mixBlendMode: "screen", filter: "blur(14px)" }}
          />
        ) : null}

        <ClubWindow state={state} />

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-ground to-transparent"
        />
      </div>

      <div className="relative z-10 px-5 pb-16 pt-8 sm:px-8 md:absolute md:left-[5%] md:top-1/2 md:w-[40%] md:-translate-y-1/2 md:p-0">
        <h1 className="text-balance font-display text-[clamp(2.5rem,11vw,3.75rem)] uppercase leading-[0.92] tracking-[-0.01em] text-chalk md:text-[5.4cqw]">
          {t("headline")}
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-silver md:mt-[1.6cqw] md:text-[1.3cqw]">
          {t("lede")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 md:mt-[2.2cqw] md:gap-[1cqw]">
          <ActionLink
            href="/kalender"
            className="md:px-[2.2cqw] md:py-[1.1cqw] md:text-[0.95cqw]"
          >
            {t("primaryCta")}
          </ActionLink>
          <ActionLink
            href="/kontakt#bliv-medlem"
            variant="ghost"
            className="md:px-[2.2cqw] md:py-[1.1cqw] md:text-[0.95cqw]"
          >
            {t("secondaryCta")}
          </ActionLink>
        </div>

        <p className="mt-8 text-sm text-silver md:mt-[2cqw] md:text-[0.95cqw]">
          {t("address")}
        </p>
      </div>
    </section>
  );
}
