import { Label, Numeral, Title } from "@components/ui/text";

export interface RatingListCopy {
  rank: string;
  player: string;
  rating: string;
  rapid: string;
  blitz: string;
  fide: string;
}

export interface FormattedRating {
  id: string;
  name: string;
  rank: string;
  rating: string;
  rapid: string;
  blitz: string;
  fide: string;
}

export function RatingList({
  rows,
  copy,
}: {
  rows: FormattedRating[];
  copy: RatingListCopy;
}) {
  return (
    <div>
      <div
        aria-hidden
        className="mb-2 hidden items-baseline gap-6 border-b border-hairline pb-3 md:flex"
      >
        <Label size="sm" className="w-10 shrink-0">
          {copy.rank}
        </Label>
        <Label size="sm" className="min-w-0 flex-1">
          {copy.player}
        </Label>
        <RatingHeadings copy={copy} />
      </div>

      <ol>
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-3 border-b border-hairline py-5 first:border-t md:flex-row md:items-baseline md:gap-6 md:py-6"
          >
            <div className="flex min-w-0 items-baseline gap-4 md:flex-1 md:gap-6">
              <Numeral size="sm" color="silver" className="w-10 shrink-0">
                {row.rank}
              </Numeral>
              <Title size="md" as="span" className="min-w-0 text-balance">
                {row.name}
              </Title>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pl-14 sm:grid-cols-4 md:flex md:gap-6 md:pl-0">
              <RatingFigure label={copy.rating} value={row.rating} />
              <RatingFigure label={copy.rapid} value={row.rapid} />
              <RatingFigure label={copy.blitz} value={row.blitz} />
              <RatingFigure label={copy.fide} value={row.fide} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RatingHeadings({ copy }: { copy: RatingListCopy }) {
  return (
    <div className="flex shrink-0 gap-6">
      <Label size="sm" className="w-20 text-right">
        {copy.rating}
      </Label>
      <Label size="sm" className="w-20 text-right">
        {copy.rapid}
      </Label>
      <Label size="sm" className="w-20 text-right">
        {copy.blitz}
      </Label>
      <Label size="sm" className="w-20 text-right">
        {copy.fide}
      </Label>
    </div>
  );
}

function RatingFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 md:w-20 md:items-end">
      <Label size="sm" className="md:hidden">
        {label}
      </Label>
      <Numeral size="sm">{value}</Numeral>
    </div>
  );
}
