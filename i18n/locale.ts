import { cookies, headers } from "next/headers";

export const locales = ["da", "en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "da";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;

  const ranked = header
    .split(",")
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(";");
      const quality = params.find((param) => param.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: quality ? Number.parseFloat(quality.trim().slice(2)) : 1,
      };
    })
    .filter((entry) => entry.tag.length > 0 && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return undefined;
}

/**
 * Single source of locale resolution: explicit choice, then browser preference,
 * then Danish. Nothing else in the app reads the cookie or the header.
 */
export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const chosen = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const headerList = await headers();
  return fromAcceptLanguage(headerList.get("accept-language")) ?? defaultLocale;
}
