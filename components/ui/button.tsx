import type { ComponentProps } from "react";
import { cn } from "@lib/utils";

type Variant = "primary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "action-button--primary",
  ghost: "action-button--ghost",
  danger: "action-button--danger",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("action-button label-caps", variants[variant], className)}
      {...props}
    />
  );
}
