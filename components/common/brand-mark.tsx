import Image from "next/image";
import { club } from "@lib/content/club";

/** The knight is the club's binding mark; ultramarine stays fixed. */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/logoSpringeren.svg"
        alt=""
        width={36}
        height={48}
        priority
        className="h-12 w-auto shrink-0"
      />
      <span
        className={`label-caps whitespace-nowrap text-chalk ${
          compact ? "text-[0.8125rem]" : "text-sm sm:text-base"
        }`}
      >
        {club.name}
      </span>
    </span>
  );
}
