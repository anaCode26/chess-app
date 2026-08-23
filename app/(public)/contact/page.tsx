import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";
import { Body, Caption, Label, Numeral, Title } from "@components/ui/text";
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
              <Label color="amber" className="shrink-0 md:w-64">
                {roles(officer.role)}
              </Label>
              <Body as="span" color="chalk" className="flex-1">
                {officer.name}
              </Body>
              <span className="flex flex-col gap-1 md:items-end">
                {officer.phone ? <Caption as="span">{officer.phone}</Caption> : null}
                {officer.email ? (
                  <a
                    href={`mailto:${officer.email}`}
                    className="break-all underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-amber"
                  >
                    <Caption as="span" color="inherit">
                      {officer.email}
                    </Caption>
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
          <Title size="lg" id="bliv-medlem-titel">
            {join("heading")}
          </Title>
          <Numeral size="lg" className="mt-5 block">
            {join("price", { price })}
          </Numeral>
          <Body className="mt-6 max-w-prose">{join("note")}</Body>
          <Body className="mt-6 max-w-prose">{footer("payment")}</Body>
          <Body color="chalk" className="mt-3">
            {footer("bank", { reg: club.bank.reg, account: club.bank.account })}
          </Body>
        </section>
      </div>
    </>
  );
}
