import type { CSSProperties, ReactNode } from "react";
import { cn } from "@lib/utils";

export type TextColor = "chalk" | "silver" | "amber" | "ultramarine";

const colorMap: Record<TextColor, string> = {
  chalk: "var(--chalk)",
  silver: "var(--silver)",
  amber: "var(--amber)",
  ultramarine: "var(--ultramarine)",
};

type ColorProp = TextColor | "inherit";

type BaseProps = {
  color?: ColorProp;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
};

function resolveStyle(
  fontSize: string,
  defaultColor: TextColor,
  color: ColorProp | undefined,
  style: CSSProperties | undefined,
): CSSProperties {
  const resolved = color === "inherit" ? undefined : (color ?? defaultColor);

  return {
    fontSize,
    ...(resolved ? { color: colorMap[resolved] } : {}),
    ...style,
  };
}

type TitleSize = "lg" | "md" | "sm";
type NumeralSize = "lg" | "md";
type LabelSize = "lg" | "md" | "sm";

const titleSizeMap: Record<TitleSize, string> = {
  lg: "1.875rem",
  md: "1.5rem",
  sm: "1.25rem",
};

const numeralSizeMap: Record<NumeralSize, string> = {
  lg: "2.25rem",
  md: "clamp(1.75rem, 5vw, 2.25rem)",
};

const labelSizeMap: Record<LabelSize, string> = {
  lg: "0.8125rem",
  md: "0.75rem",
  sm: "0.6875rem",
};

type TitleAs = "h1" | "h2" | "h3" | "h4" | "p" | "dt" | "span";
type BodyAs = "p" | "span" | "div" | "dd" | "li" | "address";
type CaptionAs = "p" | "span";
type LabelAs = "span" | "p" | "h2" | "h3";

export function Display({
  color,
  className,
  style,
  children,
  id,
}: BaseProps) {
  return (
    <h1
      id={id}
      className={cn(
        "text-balance font-display uppercase leading-[0.92] tracking-[-0.01em]",
        className,
      )}
      style={resolveStyle(
        "clamp(2.5rem, 11vw, 3.75rem)",
        "chalk",
        color,
        style,
      )}
    >
      {children}
    </h1>
  );
}

export function Headline({
  color,
  className,
  style,
  children,
  id,
}: BaseProps) {
  return (
    <h1
      id={id}
      className={cn(
        "text-balance font-display uppercase leading-[0.95] tracking-[-0.01em]",
        className,
      )}
      style={resolveStyle(
        "clamp(2.25rem, 5vw, 4rem)",
        "chalk",
        color,
        style,
      )}
    >
      {children}
    </h1>
  );
}

export function Title({
  as: Tag = "h2",
  size = "md",
  color,
  className,
  style,
  children,
  id,
}: BaseProps & { as?: TitleAs; size?: TitleSize }) {
  return (
    <Tag
      id={id}
      className={cn("font-display uppercase leading-tight", className)}
      style={resolveStyle(titleSizeMap[size], "chalk", color, style)}
    >
      {children}
    </Tag>
  );
}

export function Numeral({
  size = "lg",
  color,
  className,
  style,
  children,
  id,
}: BaseProps & { size?: NumeralSize }) {
  return (
    <span
      id={id}
      className={cn(
        "font-display uppercase leading-none tabular-nums",
        className,
      )}
      style={resolveStyle(numeralSizeMap[size], "chalk", color, style)}
    >
      {children}
    </span>
  );
}

export function Body({
  as: Tag = "p",
  color,
  className,
  style,
  children,
  id,
}: BaseProps & { as?: BodyAs }) {
  return (
    <Tag
      id={id}
      className={cn("leading-relaxed", className)}
      style={resolveStyle("1rem", "silver", color, style)}
    >
      {children}
    </Tag>
  );
}

export function Caption({
  as: Tag = "p",
  color,
  className,
  style,
  children,
  id,
}: BaseProps & { as?: CaptionAs }) {
  return (
    <Tag
      id={id}
      className={cn("leading-normal", className)}
      style={resolveStyle("0.875rem", "silver", color, style)}
    >
      {children}
    </Tag>
  );
}

export function Label({
  as: Tag = "span",
  size = "md",
  color,
  className,
  style,
  children,
  id,
}: BaseProps & { as?: LabelAs; size?: LabelSize }) {
  return (
    <Tag
      id={id}
      className={cn("label-caps leading-none", className)}
      style={resolveStyle(labelSizeMap[size], "silver", color, style)}
    >
      {children}
    </Tag>
  );
}

export type { TitleAs, BodyAs, CaptionAs, LabelAs, TitleSize, NumeralSize, LabelSize };
