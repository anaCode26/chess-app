import type { ReactNode } from "react";
import { Caption, Label } from "@components/ui/text";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label as="label" htmlFor={htmlFor} color="chalk">
        {label}
      </Label>
      {children}
      {hint && !error ? <Caption>{hint}</Caption> : null}
      {error ? <Caption style={{ color: "var(--destructive)" }}>{error}</Caption> : null}
    </div>
  );
}
