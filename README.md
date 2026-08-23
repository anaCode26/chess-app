# chess-app

Chess club website and tournament management system.

## Stack

- Next.js (App Router) + React 19 + TypeScript
- Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- Auth.js (`next-auth` v5)
- Tailwind CSS v4 + shadcn
- Vitest (unit + integration via Testcontainers)
- Docker Compose (Postgres + MinIO)

## Folder layout

```
actions/          # server actions by domain
app/              # App Router: (public), (auth), (backoffice), api
components/       # common /, features /, ui /
lib/              # db, env, auth, storage, email, …
repositories/     # data-access layer
prisma/           # schema, migrations, seed
tests/            # unit + integration
types/            # ambient types (e.g. next-auth)
```

Path aliases: `@/*`, `@actions/*`, `@repositories/*`, `@components/*`, `@lib/*`, `@tests/*`.

## Setup

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm db:migrate
pnpm dev
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | `prisma generate` + `next build` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (all projects) |
| `pnpm db:migrate` | Prisma migrate |
| `pnpm db:seed` | Prisma seed |
