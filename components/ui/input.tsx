import type { ComponentProps } from "react";
import { cn } from "@lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full min-w-0 rounded-sm border border-hairline bg-white px-3 text-base text-chalk placeholder:text-silver disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}
