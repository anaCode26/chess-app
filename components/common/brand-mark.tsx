import Image from "next/image";
import { club } from "@lib/content/club";

/**
 * The knight is the club's binding mark and its ultramarine is fixed, so on the
 * night ground it sits on a pale plate rather than being recoloured.
 */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-9 w-8 shrink-0 items-center justify-center bg-chalk">
        <Image
          src="/logoSpringeren.svg"
          alt=""
          width={18}
          height={24}
          priority
          className="h-6 w-auto"
        />
      </span>
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
