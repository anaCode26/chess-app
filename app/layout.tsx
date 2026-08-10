import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { getUserLocale } from "@/i18n/locale";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const DIRECTION_CONTRACT = `<!--
THESIS: The club is the one lit window at the end of a dark, wet Thursday walk. It refuses the centred hero, three cards and board-green accent every club site ships.
OWN-WORLD: Blue-hour cobalt over near-black, a single transit amber carrying all light and every action, ultramarine reserved for the knight mark. Condensed grotesque caps, 1px hairlines, no shadows, no cards.
STORY: A stranger sees the hall is lit, learns Thursday from 17.30 is free and needs no signup, and walks in. A member reads which slot is running right now.
FIRST VIEWPORT: Full-bleed illustrated night street; headline in the left third over the sky; the amber-lit hall window right of centre holding three schedule rows with the live one marked; amber primary action under the lede; events rail on the lower band.
FORM: Blue Hour, a dealt challenger taken over grounded candidate 4 (the wall chart); seed key 73a98259.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: { default: t("title"), template: `%s — Valby Skakklub` },
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getUserLocale();

  return (
    <html lang={locale} className={`${archivo.variable} ${anton.variable}`}>
      <body className="antialiased">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {/* No NextIntlClientProvider: every consumer of the catalogs is a Server Component. */}
        {children}
      </body>
    </html>
  );
}
