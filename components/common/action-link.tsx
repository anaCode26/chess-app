import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost";

/**
 * Styles live in globals.css (unlayered `a.action-link--*`) so they beat the
 * bare `a { background-color: transparent }` reset that otherwise wipes the
 * amber fill after first paint.
 */
const variants: Record<Variant, string> = {
  primary: "action-link--primary",
  ghost: "action-link--ghost",
};

interface ActionLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
}

export function ActionLink({
  variant = "primary",
  className = "",
  ...props
}: ActionLinkProps) {
  return (
    <Link
      className={`action-link label-caps ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
