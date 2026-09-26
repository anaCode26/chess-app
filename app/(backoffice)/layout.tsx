import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BrandMark } from "@components/common/brand-mark";
import { BackofficeSidebar } from "@components/features/backoffice/sidebar";
import { Label } from "@components/ui/text";
import { auth } from "@lib/auth/auth";
import { LOGIN_PATH } from "@lib/auth/auth.config";
import { hasPermission } from "@lib/auth/permissions";
import { MODULES } from "@lib/constants/modules";

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `proxy.ts` already turned away anyone without access; this is the same
  // check on the server, so a missing matcher could never expose the shell.
  const session = await auth();
  if (!session) redirect(LOGIN_PATH);

  const t = await getTranslations("backoffice");
  const items = [
    { href: "/backoffice", label: t("dashboard") },
    ...MODULES.filter((module) =>
      hasPermission(session.user.permissions, module.key, "read"),
    ).map((module) => ({
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
