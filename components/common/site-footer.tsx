import { getTranslations } from "next-intl/server";
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
          <h2 className="label-caps text-[0.75rem] text-amber">{t("visitHeading")}</h2>
          <address className="mt-5 space-y-1 not-italic text-silver">
            <p className="text-chalk">{club.street}</p>
            <p>
              {club.postalCode} {club.city}
            </p>
          </address>
          <p className="mt-5 text-sm text-silver">{t("founded")}</p>
        </section>

        <section>
          <h2 className="label-caps text-[0.75rem] text-amber">{t("contactHeading")}</h2>
          <ul className="mt-5 space-y-4">
            {listed.map((officer) => (
              <li key={officer.role}>
                <p className="label-caps text-[0.6875rem] text-silver">
                  {roles(officer.role)}
                </p>
                <p className="mt-1 text-chalk">{officer.name}</p>
                {officer.email ? (
                  <a
                    href={`mailto:${officer.email}`}
                    className="mt-0.5 inline-block break-all text-sm text-silver underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-amber"
                  >
                    {officer.email}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="label-caps text-[0.75rem] text-amber">{t("paymentHeading")}</h2>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-silver">
            {t("payment")}
          </p>
          <p className="mt-3 text-sm text-chalk">
            {t("bank", { reg: club.bank.reg, account: club.bank.account })}
          </p>
        </section>
      </div>
    </footer>
  );
}
