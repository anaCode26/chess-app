import { Body, Label, Numeral } from "@components/ui/text";

export function DuesList({
  heading,
  rows,
}: {
  heading: string;
  rows: { id: string; label: string; price: string }[];
}) {
  return (
    <div className="mt-10">
      <Label as="h3">{heading}</Label>
      <ol className="mt-6">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-baseline justify-between gap-6 border-b border-hairline py-5 first:border-t"
          >
            <Body as="span" color="chalk" className="min-w-0">
              {row.label}
            </Body>
            <Numeral size="sm" className="shrink-0">
              {row.price}
            </Numeral>
          </li>
        ))}
      </ol>
    </div>
  );
}
