import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { club, officers } from "@lib/content/club";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");

  return { title: t("title"), description: t("description") };
}

export default async function ContactPage() {
  const [t, roles, join, footer, format] = await Promise.all([
    getTranslations("contactPage"),
    getTranslations("roles"),
    getTranslations("join"),
    getTranslations("footer"),
    getFormatter(),
  ]);

  const price = format.number(club.membership.amount, {
    style: "currency",
    currency: club.membership.currency,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <ul>
          {officers.map((officer) => (
            <li
              key={officer.role}
              className="flex flex-col gap-2 border-b border-hairline py-7 first:border-t md:flex-row md:items-baseline md:gap-10"
            >
              <span className="label-caps shrink-0 text-[0.75rem] text-amber md:w-64">
                {roles(officer.role)}
              </span>
              <span className="flex-1 text-lg text-chalk">{officer.name}</span>
              <span className="flex flex-col gap-1 text-sm text-silver md:items-end">
                {officer.phone ? <span>{officer.phone}</span> : null}
                {officer.email ? (
                  <a
                    href={`mailto:${officer.email}`}
                    className="break-all underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-amber"
                  >
                    {officer.email}
                  </a>
                ) : null}
              </span>
            </li>
          ))}
        </ul>

        <section
          id="bliv-medlem"
          aria-labelledby="bliv-medlem-titel"
          className="mt-20 scroll-mt-24 border-t border-amber/45 pt-10"
        >
          <h2
            id="bliv-medlem-titel"
            className="font-display text-3xl uppercase leading-tight text-chalk"
          >
            {join("heading")}
          </h2>
          <p className="mt-5 font-display text-4xl uppercase leading-none text-amber">
            {join("price", { price })}
          </p>
          <p className="mt-6 max-w-prose leading-relaxed text-silver">{join("note")}</p>
          <p className="mt-6 max-w-prose leading-relaxed text-silver">
            {footer("payment")}
          </p>
          <p className="mt-3 text-chalk">
            {footer("bank", { reg: club.bank.reg, account: club.bank.account })}
          </p>
        </section>
      </div>
    </>
  );
}
