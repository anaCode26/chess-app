import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Body, Label, Title } from "@components/ui/text";

describe("text components", () => {
  it("should use silver as the default Body colour when no color is passed", () => {
    const html = renderToStaticMarkup(<Body>Hello</Body>);

    expect(html).toContain("Hello");
    expect(html).toMatch(/color:\s*var\(--silver\)/);
    expect(html).toMatch(/font-size:\s*1rem/);
  });

  it("should apply the display face on Title", () => {
    const html = renderToStaticMarkup(<Title>Open</Title>);

    expect(html).toContain("font-display");
    expect(html).toMatch(/font-size:\s*1\.5rem/);
  });

  it("should apply label-caps on Label", () => {
    const html = renderToStaticMarkup(<Label>Nav</Label>);

    expect(html).toContain("label-caps");
    expect(html).toMatch(/color:\s*var\(--silver\)/);
  });

  it("should omit colour when color is inherit", () => {
    const html = renderToStaticMarkup(<Body color="inherit">Hello</Body>);

    expect(html).not.toMatch(/color:\s*var\(--silver\)/);
  });
});
