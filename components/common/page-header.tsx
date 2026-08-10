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
        <h1 className="text-balance font-display text-[clamp(2.25rem,5vw,4rem)] uppercase leading-[0.95] tracking-[-0.01em] text-chalk">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-silver">{intro}</p>
        ) : null}
      </div>
    </div>
  );
}
