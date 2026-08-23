import { getTranslations } from "next-intl/server";
import { Body, Caption, Label } from "@components/ui/text";
import { club, officers } from "@lib/content/club";

const FOOTER_ROLES = ["chair", "tournamentDirector"] as const;

export async function SiteFooter() {
  const [t, roles] = await Promise.all([
    getTranslations("footer"),
    getTranslations("roles"),
  ]);

  const listed = FOOTER_ROLES.map((role) =>
    officers.find((officer) => officer.role === role),
  ).filter((officer) => officer !== undefined);

  return (
    <footer className="border-t border-hairline bg-ground">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 sm:px-8 md:grid-cols-3 md:gap-8">
        <section>
          <Label as="h2" color="amber">
            {t("visitHeading")}
          </Label>
          <address className="mt-5 space-y-1 not-italic">
            <Body color="chalk">{club.street}</Body>
            <Body>
              {club.postalCode} {club.city}
            </Body>
          </address>
          <Caption className="mt-5">{t("founded")}</Caption>
        </section>

        <section>
          <Label as="h2" color="amber">
            {t("contactHeading")}
          </Label>
          <ul className="mt-5 space-y-4">
            {listed.map((officer) => (
              <li key={officer.role}>
                <Label size="sm">{roles(officer.role)}</Label>
                <Body color="chalk" className="mt-1">
                  {officer.name}
                </Body>
                {officer.email ? (
                  <a
                    href={`mailto:${officer.email}`}
                    className="mt-0.5 inline-block break-all underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-amber"
                  >
                    <Caption as="span" color="inherit">
                      {officer.email}
                    </Caption>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Label as="h2" color="amber">
            {t("paymentHeading")}
          </Label>
          <Caption className="mt-5 max-w-prose leading-relaxed">{t("payment")}</Caption>
          <Caption color="chalk" className="mt-3">
            {t("bank", { reg: club.bank.reg, account: club.bank.account })}
          </Caption>
        </section>
      </div>
    </footer>
  );
}
