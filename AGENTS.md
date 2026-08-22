# AGENTS.md

Guidance for AI agents working in this repository (Cursor and compatible tools).

**Project / repo:** `chess-app` 
**Product brand:** Valby Skakklub — a chess club in Valby, Copenhagen (Høffdingsvej 10, 2500 Valby). This project replaces the club's existing site at `valbyskakklub.dk`.

Earlier drafts of this file used "Chess App" and "Springeren" as the brand. Both are wrong. The knight logo in `public/logoSpringeren.svg` is correct and is the only asset kept from the old site; only its filename is misleading. See [PRODUCT.md](PRODUCT.md) for confirmed club facts.

## Design System

All visual decisions (colors, typography, spacing, radii, shadows, motion, component specs, copy rules) belong in [DESIGN.md](DESIGN.md). **That file is the source of truth for UI — it outranks taste and this file.**

`DESIGN.md` is written. It documents the shipped system — North Star **"The Lit Window"** — as YAML token frontmatter plus the eight canonical DESIGN.md-spec sections, with `.impeccable/design.json` as its machine-readable sidecar. Read it before changing any UI.

The load-bearing rules in short, though the file itself is what binds:

- Amber `#ffb000` is light: the lit hall and every action, and nothing else on any surface.
- The system is flat. 1px hairlines separate; the one shadow that exists belongs to the lit schedule window.
- 2px radius on interactive surfaces, 0 on rules, rails and panes. There is no card component, and there must not be one.
- Anton capitals announce, `.label-caps` condensed capitals label, Archivo sentence case reads.
- No photography, no gradients, no second accent, no warm greys.

The night-time version of this world (`.impeccable/brief-body.md`, `mocks/home-comp-a.*`, `quality-bar/*`) is **withdrawn**. Those files are build history, not a target — do not restore the dark palette or the street illustration from them.

## Project Overview

**Valby Skakklub** (`chess-app`) is a chess club website and tournament management system. It has two faces sharing one Next.js codebase:

1. **Public site** — club presence for visitors and members.
2. **Backoffice** (`/backoffice`) — admin panel with role-based permissions to manage content and tournaments.

### Public site (planned)

- **Home** — the club night (Thursdays from 17:30), free teaching slots, upcoming events, tournaments, and how to join.
- **Events** — upcoming public events, created and published from the backoffice.
- **Tournaments** — tournaments created from the backoffice (permissioned). Visible publicly as a **list + detail** for now. Calendar vs dashboard presentation is **undecided** — do not build both; stick to list/detail until a decision is recorded here.
- **Tournament registration** — tournament cards/detail expose a register CTA. Users must be logged in (or complete registration) to register for a tournament.
- **Membership signup** — new members register through the app; there is no offline-only path.

**No payments in the app.** Tournament entry fees and membership dues are paid by bank transfer to the club's Nordea account. Registration records the registration and surfaces the payment details; it never takes money. Do not add a payment provider.
- **Gallery** — club photos.
- **Contact** — contact information + contact form (email forwarding pattern similar to eet1-concordia).

### Auth

- Login and registration for members.
- Session required to register for tournaments.
- Backoffice access is separate and permissioned (roles + module read/write).

### Backoffice modules (planned)

| Module key     | Purpose                                      |
| -------------- | -------------------------------------------- |
| `events`       | Create/edit/publish club events              |
| `tournaments`  | Create/edit/publish tournaments              |
| `users`        | Users, roles, permissions                    |
| `gallery`      | Manage gallery media                         |

When a module is added or renamed, update `lib/constants/modules.ts` first (then routes, proxy guard, and sidebar).

### Roadmap (do not build until asked)

- In-tournament pairing and match scheduling (e.g. Danish system for ~15 players).
- “Who plays whom” boards and round management.

Document future ideas here; do not implement them unprompted.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** shadcn/ui (Radix UI) + Tailwind CSS v4
- **Auth:** next-auth v5 (Auth.js)
- **ORM:** Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- **Validation:** Zod (schemas + types colocated with actions)
- **i18n:** `next-intl` (three locales — see [Internationalization](#internationalization))
- **Email:** Nodemailer
- **File storage:** S3-compatible (MinIO locally; Cloudflare R2 later)
- **Testing:** Vitest (unit + integration via Testcontainers)
- **Lint/format:** ESLint (Next.js + typescript-eslint strict) + Prettier
- **Local infra:** Docker Compose (PostgreSQL + MinIO)
- **Package manager:** pnpm

No Mercado Pago or TipTap unless explicitly added later.

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm format

pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:watch

pnpm db:migrate
pnpm db:seed
pnpm db:generate
pnpm db:setup

docker compose up -d
```

## Folder Structure

```
actions/              ← Server Actions, grouped by entity
  <entity>/
    <entity>.actions.ts
    <entity>.types.ts   ← Zod schemas + inferred input types

repositories/         ← Prisma data access only, one file per entity

components/
  ui/                 ← shadcn primitives
  common/             ← shared custom components
  features/           ← domain-scoped UI (+ colocated hooks)

lib/
  auth/               ← Auth.js config + auth helpers/services
  constants/          ← modules, routes, etc.
  email/              ← sender + templates
  storage/            ← S3 helpers
  env.ts              ← Zod-validated env — import from here, not process.env
  db.ts               ← Prisma client singleton (`db`)

app/
  (public)/           ← public club site
  (auth)/             ← login / register
  (backoffice)/       ← /backoffice/*
  api/                ← Auth.js route, uploads, webhooks if needed

messages/             ← translation catalogs: da.json, en.json, es.json
i18n/                 ← next-intl request config + locale resolution (no routing config)

tests/
  unit/               ← *.unit.test.ts
  integration/        ← *.integration.test.ts
  helpers/            ← fixtures, mocks, env setup

types/                ← cross-cutting ambient types only (e.g. next-auth.d.ts)
prisma/               ← schema, migrations, seed
```

## Path Aliases

Defined in `tsconfig.json`. Prefer these over deep relative imports across top-level folders:

```
@/*             → ./
@actions/*      → ./actions/*
@repositories/* → ./repositories/*
@components/*   → ./components/*
@lib/*          → ./lib/*
@tests/*        → ./tests/*
```

## Internationalization

The club is international. **Three locales ship together — none is optional:**

| Locale | Role |
| ------ | ---------------------------------- |
| `da`   | Default. Danish is the club's language. |
| `en`   | Full parity with Danish. |
| `es`   | Full parity with Danish. |

Rules:

- **The locale is never in the URL.** No `[locale]` segment, no path prefix, no per-language subdomain. Every page has exactly one URL and serves whichever language the visitor is on. Do not introduce localized routing later.
- Locale is resolved per request in this order: the `NEXT_LOCALE` cookie (the visitor's explicit choice) → the `Accept-Language` header → `da`. That resolution lives in one place (`i18n/locale.ts`); nothing else reads the cookie or the header directly.
- `i18n/request.ts` is `next-intl`'s `getRequestConfig` in its **without-i18n-routing** mode: it calls the resolver and loads `messages/<locale>.json`. There is no `routing.ts`, no `Link`/`redirect` wrappers from `next-intl/navigation` — use the plain `next/link` and `next/navigation` ones.
- The language switcher is a Server Action that writes the `NEXT_LOCALE` cookie and revalidates the page. It must never navigate to a different URL.
- **Do not add `next-intl` middleware** — without routing there is nothing for it to do. `proxy.ts` holds only the backoffice guard, and `middleware.ts` must never be created.
- The root layout sets `<html lang>` from the resolved locale.
- Because the locale comes from a cookie/header, localized pages render per request. Do not mark them `force-static`, and never cache localized output in a way that could be shared across visitors on different languages.
- **Accepted SEO trade-off:** with one URL per page, crawlers only index the language served to them and there is no `hreflang`. This is a deliberate product decision — do not "fix" it by adding locale routes.
- All user-facing strings come from `messages/<locale>.json`. No hardcoded copy in components.
- **Never assume Danish string lengths.** Spanish and English run materially longer; layouts must tolerate it.
- **No text inside images or SVGs.** The logo is a mark, not a wordmark.
- Dates, times, and numbers are formatted through `next-intl`, not hand-built.
- Club-specific terms (`lynskak`, `EMT`, `Åbnefolk`, `Valbymesterskabet`) get real translations or a short gloss in `en`/`es` — do not ship untranslated loanwords.
- **Localization covers UI chrome only.** User-generated content (events, tournaments, gallery captions) is stored as a single string in whatever language the author wrote it, and is rendered as-is in every locale. No translation fields on content models, no fallback chains, no "missing translation" states. A Spanish-speaking visitor sees Spanish navigation around a Danish event title — that is the intended behaviour, so never style content as if it were broken or untranslated.

`next-intl` is **not yet installed** — adding it is the first step of the i18n work.

## Architecture

Single Next.js app with route groups `(public)`, `(auth)`, and `(backoffice)` directly under `app/`. URLs carry no locale segment — see [Internationalization](#internationalization).

### Data flow

```
Server Component / API Route
  → action (Zod validation, auth / permission checks)
    → repository (Prisma via `db`)
```

- Actions own business rules and auth checks.
- Repositories contain Prisma queries only — no business logic.
- Components never import from `@repositories/` directly.

### Repositories and services

Export a **single named object** (not loose functions):

```ts
export const tournamentRepository = {
  async findPublished() { ... },
  async create(data: ...) { ... },
}

export const authService = {
  async authorizeCredentials(credentials: ...) { ... },
}
```

### Actions

- Mutations are Server Actions (except uploads/webhooks → API routes).
- Actions **throw `Error` on failure** — do not return `{ data, error }` envelopes. On success, return data (or `void`).
- Validate inputs with Zod schemas from the entity’s `.types.ts` before any DB work.
- Mutations should have a corresponding integration test.
- **No dynamic imports** — static top-level imports only.

### Types and schemas

Each `actions/<entity>/` folder has `<entity>.types.ts` with:

1. Zod input schemas for actions.
2. Input types via `z.infer<typeof schema>`.

Return types should come from Prisma (`Prisma.XGetPayload<...>` or model types) unless the shape is a custom projection.

**Never duplicate types — import them.** Root `types/` is for cross-cutting ambient modules only.

### Permissions

- Roles live in the DB with granular read/write permissions per backoffice module.
- Enforce permissions server-side in actions and Server Components — never trust the client alone.
- `lib/constants/modules.ts` is the source of truth for module `key`, `label`, and route segment.
- Guard `/backoffice/*` in `proxy.ts` (Next.js 16). **Never create `middleware.ts`** — it conflicts with `proxy.ts`.

### File uploads

Files go to S3-compatible storage. The DB stores object key/URL only. Upload routes under `app/api/upload/`.

### Email

Nodemailer for transactional mail (e.g. contact form). Templates under `lib/email/templates/`.

### Prisma conventions

Every model includes:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

UI-editable entities also track `modifiedByUserId` (nullable in schema; required in repository create/update signatures when a session exists). Use named relations to avoid Prisma ambiguity.

## Testing

- Integration tests use Testcontainers PostgreSQL — do not mock the DB for integration tests.
- Unit tests may mock external deps (S3, email), not the whole internal graph by default.
- Arrange / Act / Assert structure.
- Test names: `"should XXXX when YYYY"`.

```bash
pnpm test:unit
pnpm test:integration
```

## UI Conventions

- Responsive, mobile-first (`sm:`, `md:`, `lg:`).
- Keep pages/components under ~300 lines; extract when approaching the limit.
- Every page exports `metadata` / `generateMetadata` with a `title`.
- Public pages should get solid SEO metadata once real content exists.
- Follow [DESIGN.md](DESIGN.md) for all new and changed UI. If a pattern it does not cover comes up, add it to that file rather than improvising per component.

## Reference project

Architecture and conventions are intentionally aligned with `eet1-concordia` (same stack shape: actions → repositories, public + backoffice, Auth.js, Prisma, Vitest). Domain content is chess club / tournaments — do not copy school-specific features (enrollments, Mercado Pago, TipTap news, etc.) unless asked.
