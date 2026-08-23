---
name: new-page
description: Scaffold a new page in the Valby Skakklub app against DESIGN.md and the project's route, metadata and i18n conventions. Use when creating, adding or scaffolding any new route or page under app/(public), app/(auth) or app/(backoffice), or when the user says "new page", "add a route" or "add a screen".
---

# New page

## Step 1 — Read the design system before writing any JSX

Read [DESIGN.md](../../../DESIGN.md) in full. It outranks taste and AGENTS.md
for anything visual. Do not scaffold from a generic Next.js/shadcn default and
retrofit styles afterwards — the defaults violate this system (cards, shadows,
warm greys, non-2px radii).

Then read one existing page as the shape to copy:
`app/(public)/tournaments/page.tsx` (page header + record rows) or
`app/(public)/gallery/page.tsx` (page header + prose).

## Step 2 — Place the route

- Route group: `(public)` for the club site, `(auth)` for login/register,
  `(backoffice)` for `/backoffice/*`.
- **No `[locale]` segment, ever.** One URL per page; locale comes from the
  `NEXT_LOCALE` cookie via `i18n/locale.ts`.
- URL segments are **English kebab-case**, matching the existing siblings:
  `calendar`, `contact`, `gallery`, `tournaments`. The Danish default locale
  lives in the copy, not in the route.
- A new backoffice module means updating `lib/constants/modules.ts` first (it is
  the source of truth for module `key`, `label` and route segment — create it if
  it does not exist yet), then the `proxy.ts` guard and the sidebar.

## Step 3 — Metadata and copy

Every page exports metadata, and every string comes from the catalogs:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@components/common/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("<pageKey>");

  return { title: t("title"), description: t("description") };
}

export default async function <Name>Page() {
  const t = await getTranslations("<pageKey>");

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />

      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        {/* content */}
      </div>
    </>
  );
}
```

- Add the `<pageKey>` block to **all three** of `messages/da.json`,
  `messages/en.json`, `messages/es.json`. Danish is default; en and es are full
  parity, never stubs.
- Catalog copy is **sentence case**. Capitals come from CSS
  (`text-transform`), never from the message text.
- Interior pages open with `PageHeader`; only the home page uses display type.

## Step 4 — Style within the system

Use the semantic Tailwind tokens from `app/globals.css` — `text-chalk`,
`text-silver`, `border-hairline`, `bg-bluehour`, `bg-ground`, `text-amber`,
`font-display` — never raw hex.

| Need | Use |
| ---- | --- |
| Container | `mx-auto max-w-[90rem] px-5 py-16 sm:px-8` |
| Section heading | `font-display text-3xl uppercase leading-tight text-chalk` |
| Named row item | `font-display text-2xl uppercase leading-tight text-chalk` |
| Body copy | `max-w-prose leading-relaxed text-silver` |
| Lede | `max-w-2xl text-lg leading-relaxed text-silver` |
| Label / eyebrow / nav | `.label-caps` at 0.6875 / 0.75 / 0.8125rem |
| A list of records | hairline rows: `border-b border-hairline py-9 first:border-t` |
| Button / CTA | `ActionLink` from `@components/common/action-link` |
| Section divider | a 1px hairline, not extra whitespace |

## Step 5 — Verify before finishing

- [ ] Zero hardcoded user-facing strings; all three catalogs updated
- [ ] No card, no shadow, no gradient, no second accent, no warm grey
- [ ] Amber appears at most once per screen region, as light or the primary action
- [ ] Radius is 2px on interactive surfaces, 0 on rules, rails and panes
- [ ] Display/headline type uses `clamp()` and `text-balance`; no fixed-width
      labels — Spanish and English run longer than Danish
- [ ] No photography, no text inside images or SVGs
- [ ] Dates/times/numbers formatted through `next-intl`
- [ ] Page not marked `force-static` (localized output renders per request)
- [ ] File under ~300 lines; extract sections otherwise
- [ ] `pnpm lint` and `pnpm typecheck` pass

If the page needs a pattern DESIGN.md does not cover — inputs and form fields
are explicitly **not yet designed** — design it against the system and add the
section to DESIGN.md rather than improvising per component.
