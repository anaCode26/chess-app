import Link from "next/link";
import { Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";

const navItems = [
  { key: "clubNight", href: "/#klubaften" },
  { key: "tournaments", href: "/turneringer" },
  { key: "calendar", href: "/kalender" },
  { key: "gallery", href: "/galleri" },
  { key: "contact", href: "/kontakt" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="relative z-20 border-b border-hairline bg-ground">
      <a
        href="#indhold"
        className="label-caps sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-amber focus:px-4 focus:py-2 focus:text-[0.75rem] focus:text-chalk"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" aria-label={t("brandHome")} className="rounded-sm">
          <BrandMark />
        </Link>

        <nav aria-label={t("brandHome")} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="label-caps rounded-sm text-[0.75rem] text-silver transition-colors duration-200 hover:text-chalk"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Link
            href="/login"
            className="label-caps hidden rounded-sm border-l border-hairline pl-4 text-[0.75rem] text-silver transition-colors duration-200 hover:text-chalk sm:inline-block"
          >
            {t("login")}
          </Link>

          <details className="group relative lg:hidden">
            <summary
              aria-label={t("openMenu")}
              className="flex cursor-pointer list-none items-center rounded-sm p-1.5 text-silver transition-colors duration-200 hover:text-chalk [&::-webkit-details-marker]:hidden"
            >
              <Menu aria-hidden className="h-6 w-6" strokeWidth={1.5} />
            </summary>

            <div className="absolute right-0 top-full z-30 mt-3 w-64 border border-hairline bg-ground p-5">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="label-caps block rounded-sm text-[0.8125rem] text-silver transition-colors duration-200 hover:text-chalk"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-hairline pt-4">
                  <Link
                    href="/login"
                    className="label-caps block rounded-sm text-[0.8125rem] text-silver transition-colors duration-200 hover:text-chalk"
                  >
                    {t("login")}
                  </Link>
                </li>
                <li className="sm:hidden">
                  <LanguageSwitcher />
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
