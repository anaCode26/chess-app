# AGENTS.md

Guidance for AI agents working in this repository (Cursor and compatible tools).

**Project / repo:** `chess-app`  
**Product brand:** Chess App

## Design System

All visual decisions (colors, typography, spacing, radii, shadows, motion, component specs, copy rules) belong in [DESIGN.md](DESIGN.md). **That file is the source of truth for UI — it outranks taste and this file.**

`DESIGN.md` is intentionally empty until the brand/design is finalized. Until it is filled in:

- Do **not** invent a permanent visual identity (no default purple/indigo AI themes, no decorative glassmorphism, no fake brand tokens).
- Keep UI minimal and functional; prefer existing Tailwind/shadcn primitives already in the project.
- When `DESIGN.md` is updated, follow it for all new and changed UI.

## Project Overview

**Chess App** (`chess-app`) is a chess club website and tournament management system. It has two faces sharing one Next.js codebase:

1. **Public site** — club presence for visitors and members.
2. **Backoffice** (`/backoffice`) — admin panel with role-based permissions to manage content and tournaments.

### Public site (planned)

- **Home** — about the chess club (story, mission, what the club offers).
- **Events** — upcoming public events, created and published from the backoffice.
- **Tournaments** — tournaments created from the backoffice (permissioned). Visible publicly as a **list + detail** for now. Calendar vs dashboard presentation is **undecided** — do not build both; stick to list/detail until a decision is recorded here.
- **Tournament registration** — tournament cards/detail expose a register CTA. Users must be logged in (or complete registration) to register for a tournament.
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

## Architecture

Single Next.js app with route groups `(public)`, `(auth)`, and `(backoffice)`.

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
- Until `DESIGN.md` is filled, keep chrome minimal and avoid inventing brand assets.

## Reference project

Architecture and conventions are intentionally aligned with `eet1-concordia` (same stack shape: actions → repositories, public + backoffice, Auth.js, Prisma, Vitest). Domain content is chess club / tournaments — do not copy school-specific features (enrollments, Mercado Pago, TipTap news, etc.) unless asked.
