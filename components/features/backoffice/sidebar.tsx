"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@actions/auth/auth.actions";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/text";
import { cn } from "@lib/utils";

export function BackofficeSidebar({
  items,
  signOutLabel,
  homeLabel,
  homeHref,
}: {
  items: { href: string; label: string }[];
  signOutLabel: string;
  homeLabel: string;
  homeHref: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-8 border-b border-hairline px-5 py-6 sm:px-8 lg:w-56 lg:border-b-0 lg:border-r lg:px-6">
      <nav>
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const active =
              item.href === "/backoffice"
                ? pathname === "/backoffice"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-sm transition-colors duration-200",
                    active ? "text-chalk" : "text-silver hover:text-chalk",
                  )}
                >
                  <Label color="inherit">{item.label}</Label>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto flex flex-col items-start gap-4">
        <Link
          href={homeHref}
          className="rounded-sm text-silver transition-colors duration-200 hover:text-chalk"
        >
          <Label color="inherit">{homeLabel}</Label>
        </Link>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost">
            {signOutLabel}
          </Button>
        </form>
      </div>
    </aside>
  );
}
