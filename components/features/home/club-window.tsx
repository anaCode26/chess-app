import { getFormatter, getTranslations } from "next-intl/server";
import { Label, Numeral } from "@components/ui/text";
import { club } from "@lib/content/club";
import type { ClubNightState } from "@lib/club-night";

const SLOT_TITLE = {
  juniors: "juniorsTitle",
  women: "womenTitle",
  rounds: "roundsTitle",
} as const;

export async function ClubWindow({ state }: { state: ClubNightState }) {
  const [t, format] = await Promise.all([
    getTranslations("schedule"),
    getFormatter(),
  ]);

  const lit = state.isLit;

  return (
    <div className="w-full">
      <h2 className="sr-only">{t("heading")}</h2>

      <Label color="ultramarine" className="mb-3 block">
        {club.name}
      </Label>

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
              <Numeral size="md" color={lit ? "chalk" : "ultramarine"}>
                {slot.label}
              </Numeral>

              <Label color="inherit" className="min-w-0 flex-1 text-balance leading-[1.2]">
                {t(SLOT_TITLE[slot.id])}
              </Label>

              <span className="sr-only">{t(slot.status)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Label size="sm" className="mt-4 block">
        {state.isTonight ? t("tonight") : t("nextNight")}
        {" — "}
        {format.dateTime(state.date, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Label>
    </div>
  );
}
