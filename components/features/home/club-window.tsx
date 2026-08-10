import { getFormatter, getTranslations } from "next-intl/server";
import { club } from "@lib/content/club";
import type { ClubNightState } from "@lib/club-night";

const SLOT_TITLE = {
  juniors: "juniorsTitle",
  women: "womenTitle",
  rounds: "roundsTitle",
} as const;

/** Rain running down the glass. */
const RAIN_FILM =
  "repeating-linear-gradient(102deg, transparent 0 5px, rgba(232,238,246,0.055) 5px 6px, transparent 6px 14px)";

/** Light falling unevenly across the panes. */
const GLASS_SHEEN =
  "linear-gradient(160deg, rgba(255,255,255,0.14) 0%, transparent 38%, rgba(0,0,0,0.16) 100%)";

const MULLIONS = [25, 50, 75];

/**
 * The club's window, mounted on the painted wall behind it. The frame, mullions
 * and glass are markup so the panes can carry live, translated times; the wall
 * they sit on is the only part that is illustration.
 *
 * Placement is expressed as percentages of the hero stage, which never crops,
 * so the window stays on the brickwork at every width. Type is sized in `cqw`
 * for the same reason.
 */
export async function ClubWindow({ state }: { state: ClubNightState }) {
  const [t, format] = await Promise.all([
    getTranslations("schedule"),
    getFormatter(),
  ]);

  const lit = state.isLit;

  return (
    <section
      id="klubaften"
      aria-labelledby="klubaften-titel"
      className="absolute left-[10%] top-[30.5%] w-[80%] scroll-mt-24 md:left-[50%] md:top-[31.5%] md:w-[41%]"
    >
      <h2 id="klubaften-titel" className="sr-only">
        {t("heading")}
      </h2>

      {/* Painted on the brickwork above the window. */}
      <p className="label-caps mb-[1.4cqw] text-[2.6cqw] leading-none text-amber md:mb-[0.7cqw] md:text-[1.05cqw]">
        {club.name}
      </p>

      <div
        className={`relative aspect-[1.667] w-full border-[0.9cqw] transition-colors duration-700 ease-out md:aspect-[2.43] md:border-[0.45cqw] ${
          lit ? "border-[#141b24]" : "border-[#0d131b]"
        } bg-[#0d131b]`}
        style={
          lit
            ? {
                boxShadow:
                  "0 0 9cqw -1cqw color-mix(in srgb, var(--amber) 55%, transparent), 0 1cqw 4cqw -1cqw rgba(0,0,0,0.85)",
              }
            : { boxShadow: "0 1cqw 4cqw -1cqw rgba(0,0,0,0.85)" }
        }
      >
        <ul className="flex h-full w-full flex-col gap-[0.7cqw] md:gap-[0.35cqw]">
          {state.slots.map((slot) => (
            <li
              key={slot.id}
              className={`flex min-h-0 flex-1 items-center gap-[2.5cqw] px-[3cqw] transition-colors duration-700 ease-out md:gap-[1.4cqw] md:px-[1.5cqw] ${
                lit ? "bg-amber text-ground" : "bg-[#101d31] text-chalk"
              } ${
                slot.status === "ended"
                  ? "opacity-40"
                  : slot.status === "later" && lit
                    ? "opacity-85"
                    : ""
              }`}
            >
              <span
                className={`font-display text-[5.4cqw] leading-none tabular-nums md:text-[2cqw] ${
                  lit ? "text-ground" : "text-amber"
                }`}
              >
                {slot.label}
              </span>

              <span className="label-caps min-w-0 flex-1 text-balance text-[3cqw] leading-[1.1] md:text-[1.15cqw]">
                {t(SLOT_TITLE[slot.id])}
              </span>

              <span className="sr-only">{t(slot.status)}</span>
            </li>
          ))}
        </ul>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: GLASS_SHEEN }}
        />

        {MULLIONS.map((left) => (
          <span
            aria-hidden
            key={left}
            className="pointer-events-none absolute top-0 h-full w-[0.5cqw] bg-silver/40 md:w-[0.22cqw]"
            style={{ left: `${left}%` }}
          />
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: RAIN_FILM }}
        />
      </div>

      <p className="label-caps mt-[1.6cqw] text-[2.2cqw] leading-none text-silver md:mt-[0.8cqw] md:text-[0.9cqw]">
        {state.isTonight ? t("tonight") : t("nextNight")}
        {" — "}
        {format.dateTime(state.date, { weekday: "long", day: "numeric", month: "long" })}
      </p>
    </section>
  );
}
