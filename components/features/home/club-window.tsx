import { getFormatter, getTranslations } from "next-intl/server";
import { club } from "@lib/content/club";
import type { ClubNightState } from "@lib/club-night";

const SLOT_TITLE = {
  juniors: "juniorsTitle",
  women: "womenTitle",
  rounds: "roundsTitle",
} as const;

/**
 * Live Thursday schedule as pane rows. Lit panes go amber when club night is
 * on; otherwise they sit as soft blue fields on the daylit page.
 */
export async function ClubWindow({ state }: { state: ClubNightState }) {
  const [t, format] = await Promise.all([
    getTranslations("schedule"),
    getFormatter(),
  ]);

  const lit = state.isLit;

  return (
    <div className="w-full">
      <h2 className="sr-only">{t("heading")}</h2>

      <p className="label-caps mb-3 text-[0.75rem] leading-none text-ultramarine">
        {club.name}
      </p>

      <div
        className={`relative w-full overflow-hidden border transition-colors duration-700 ease-out ${
          lit ? "border-chalk/20 bg-chalk" : "border-hairline bg-bluehour"
        }`}
        style={
          lit
            ? {
                boxShadow:
                  "0 0 2.5rem -0.5rem color-mix(in srgb, var(--amber) 40%, transparent)",
              }
            : undefined
        }
      >
        <ul className="flex w-full flex-col gap-px">
          {state.slots.map((slot) => (
            <li
              key={slot.id}
              className={`flex min-h-0 items-center gap-4 px-4 py-5 transition-colors duration-700 ease-out sm:gap-5 sm:px-5 sm:py-6 ${
                lit ? "bg-amber text-chalk" : "bg-white text-chalk"
              } ${
                slot.status === "ended"
                  ? "opacity-40"
                  : slot.status === "later" && lit
                    ? "opacity-85"
                    : ""
              }`}
            >
              <span
                className={`font-display text-[clamp(1.75rem,5vw,2.25rem)] leading-none tabular-nums ${
                  lit ? "text-chalk" : "text-ultramarine"
                }`}
              >
                {slot.label}
              </span>

              <span className="label-caps min-w-0 flex-1 text-balance text-[0.75rem] leading-[1.2] sm:text-[0.8125rem]">
                {t(SLOT_TITLE[slot.id])}
              </span>

              <span className="sr-only">{t(slot.status)}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="label-caps mt-4 text-[0.6875rem] leading-none text-silver">
        {state.isTonight ? t("tonight") : t("nextNight")}
        {" — "}
        {format.dateTime(state.date, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>
    </div>
  );
}
