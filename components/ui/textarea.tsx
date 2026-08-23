import type { ComponentProps } from "react";
import { cn } from "@lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-[90px] w-full min-w-0 resize-y rounded-sm border border-hairline bg-white px-3 py-2 text-base text-chalk placeholder:text-silver disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}
