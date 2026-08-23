import Image from "next/image";
import { Label } from "@components/ui/text";
import { club } from "@lib/content/club";

/** The knight is the club's binding mark; ultramarine stays fixed. */
export function BrandMark() {
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
      <Label size="lg" color="chalk" className="whitespace-nowrap">
        {club.name}
      </Label>
    </span>
  );
}
