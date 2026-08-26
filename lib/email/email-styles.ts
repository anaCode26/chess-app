import type React from "react";

/**
 * The DESIGN.md palette, repeated here as literals because email clients get a
 * self-contained HTML document with no access to the app's CSS variables.
 * See the Email section of DESIGN.md for the rules these encode.
 */
const c = {
  ground: "#f3f5f8",
  bluehour: "#e2e9f3",
  hairline: "#d5dde9",
  white: "#ffffff",
  amber: "#ffb000",
  ultramarine: "#000098",
  chalk: "#0c1520",
  silver: "#5a6b82",
} as const;

/**
 * Anton and Archivo cannot be relied on in an email client, so the whole
 * document uses one safe stack. Hierarchy is carried by weight, size, casing
 * and letter-spacing instead of by typeface.
 */
const stack = "Helvetica, Arial, sans-serif";

export const emailStyles = {
  body: {
    backgroundColor: c.ground,
    fontFamily: stack,
    margin: 0,
    padding: 0,
    color: c.chalk,
  } satisfies React.CSSProperties,

  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "40px 32px",
  } satisfies React.CSSProperties,

  brand: {
    color: c.ultramarine,
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    margin: "0 0 32px 0",
  } satisfies React.CSSProperties,

  heading: {
    color: c.chalk,
    fontSize: "26px",
    fontWeight: "bold",
    lineHeight: 1.2,
    margin: "0 0 20px 0",
  } satisfies React.CSSProperties,

  paragraph: {
    color: c.silver,
    fontSize: "15px",
    lineHeight: 1.6,
    margin: "0 0 20px 0",
  } satisfies React.CSSProperties,

  detailBlock: {
    backgroundColor: c.bluehour,
    padding: "24px",
    margin: "0 0 28px 0",
  } satisfies React.CSSProperties,

  detailLabel: {
    color: c.silver,
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    textTransform: "uppercase",
    margin: "0 0 4px 0",
  } satisfies React.CSSProperties,

  detailValue: {
    color: c.chalk,
    fontSize: "16px",
    lineHeight: 1.4,
    margin: "0 0 18px 0",
  } satisfies React.CSSProperties,

  detailValueLast: {
    color: c.chalk,
    fontSize: "16px",
    lineHeight: 1.4,
    margin: 0,
  } satisfies React.CSSProperties,

  /** The one amber element in the message. Nothing else may be amber. */
  button: {
    backgroundColor: c.amber,
    borderRadius: "2px",
    color: c.chalk,
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    padding: "14px 28px",
    textDecoration: "none",
  } satisfies React.CSSProperties,

  signOff: {
    color: c.silver,
    fontSize: "15px",
    lineHeight: 1.6,
    margin: "32px 0 0 0",
  } satisfies React.CSSProperties,

  hr: {
    borderColor: c.hairline,
    borderStyle: "solid",
    borderWidth: "1px 0 0 0",
    margin: "40px 0 20px 0",
  } satisfies React.CSSProperties,

  footer: {
    color: c.silver,
    fontSize: "12px",
    lineHeight: 1.5,
    margin: 0,
  } satisfies React.CSSProperties,

  footerLink: {
    color: c.silver,
    textDecoration: "underline",
  } satisfies React.CSSProperties,
};
