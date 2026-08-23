import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { BackofficeSidebar } from "@components/features/backoffice/sidebar";
import { Label } from "@components/ui/text";
import { MODULES } from "@lib/constants/modules";

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("backoffice");
  const items = [
    { href: "/backoffice", label: t("dashboard") },
    ...MODULES.map((module) => ({
      href: `/backoffice/${module.route}`,
      label: t(module.key as "events"),
    })),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header className="border-b border-hairline px-5 py-3.5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
          <Label size="lg" color="chalk">
            {t("title")}
          </Label>
        </div>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">
        <BackofficeSidebar
          items={items}
          signOutLabel={t("signOut")}
          homeLabel={t("home")}
          homeHref="/"
        />
        <main className="min-w-0 flex-1 px-5 py-10 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
