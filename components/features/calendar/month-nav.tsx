import Link from "next/link";
import { Label, Title } from "@components/ui/text";
import { formatMonthParam, shiftMonth, type MonthKey } from "@lib/date/month";

interface MonthNavCopy {
  previous: string;
  next: string;
  today: string;
}

export function MonthNav({
  month,
  href,
  label,
  copy,
}: {
  month: MonthKey;
  href: string;
  label: string;
  copy: MonthNavCopy;
}) {
  const previous = `${href}?month=${formatMonthParam(shiftMonth(month, -1))}`;
  const next = `${href}?month=${formatMonthParam(shiftMonth(month, 1))}`;

  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-baseline justify-between gap-4"
    >
      <Title size="sm" as="h2">
        {label}
      </Title>
      <div className="flex flex-wrap items-center gap-6">
        <Link
          href={previous}
          className="rounded-sm text-silver transition-colors duration-200 hover:text-chalk"
        >
          <Label color="inherit">{copy.previous}</Label>
        </Link>
        <Link
          href={href}
          className="rounded-sm text-silver transition-colors duration-200 hover:text-chalk"
        >
          <Label color="inherit">{copy.today}</Label>
        </Link>
        <Link
          href={next}
          className="rounded-sm text-silver transition-colors duration-200 hover:text-chalk"
        >
          <Label color="inherit">{copy.next}</Label>
        </Link>
      </div>
    </nav>
  );
}
