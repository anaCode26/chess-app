import { getLocale, getTranslations } from "next-intl/server";
import { Label } from "@components/ui/text";
import { setLocaleAction } from "@actions/locale/locale.actions";
import { locales } from "@/i18n/locale";

/**
 * Writes the locale cookie and revalidates. The URL never changes, so this is a
 * form rather than a set of links.
 */
export async function LanguageSwitcher() {
  const current = await getLocale();
  const t = await getTranslations("language");

  return (
    <form action={setLocaleAction} className="flex items-center gap-1">
      <span id="language-switcher-label" className="sr-only">
        {t("label")}
      </span>
      <div
        role="group"
        aria-labelledby="language-switcher-label"
        className="flex items-center gap-1"
      >
        {locales.map((locale) => {
          const isCurrent = locale === current;

          return (
            <button
              key={locale}
              type="submit"
              name="locale"
              value={locale}
              aria-label={t(locale)}
              aria-current={isCurrent ? "true" : undefined}
              className={`rounded-sm px-2 py-1.5 transition-colors duration-200 ${
                isCurrent ? "text-amber-ink" : "text-silver hover:text-chalk"
              }`}
            >
              <Label size="sm" color="inherit">
                {locale}
              </Label>
            </button>
          );
        })}
      </div>
    </form>
  );
}
