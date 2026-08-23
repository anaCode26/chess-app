import { Body, Headline } from "@components/ui/text";

export function PageHeader({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="border-b border-hairline bg-bluehour/40">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 sm:py-20">
        <Headline>{title}</Headline>
        {intro ? <Body className="mt-6 max-w-2xl">{intro}</Body> : null}
      </div>
    </div>
  );
}
