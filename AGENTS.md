# AGENTS.md — Development & Operating Rules for AI Agents

> This document defines the non-negotiable rules, execution boundaries, and definition of ready/done for all developers and AI agents working on NusaKerja.

## 1. Core Principles

1. **Compliance is Configuration, Not Code**: All statutory rates, caps, floors, and brackets must be stored in effective-dated parameters. Never hardcode statutory figures in source code.
2. **Untrusted AI Output**: AI-generated code, tests, and documentation must pass automated typecheck, linting, and human review before merging.
3. **No Breaking API Contracts**: Preserving existing tRPC and database schema signatures is mandatory.

---

## 2. Command Palette

- Build monorepo: `pnpm build`
- Run dev server: `pnpm dev`
- Lint code: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Run unit/integration tests: `pnpm test`
- Database push: `pnpm db:push`
- Scaffold model/page: `pnpm scaffold model <name>`

---

## 3. Definition of Ready (DoR)

Before starting work on any feature:
- Business requirement, risk class, and acceptance criteria are documented in `REQUIREMENTS.md`.
- Data model changes are defined in `DATABASE.md`.
- Security/privacy implications are cleared against `SECURITY.md`.

---

## 4. Definition of Done (DoD)

Before declaring any feature complete:
- All unit/integration tests pass with 0 errors.
- TypeScript compiles strictly with `pnpm typecheck`.
- Audit logging is added for sensitive actions.
- Relevant documentation (`PROGRESS.md`, `CHANGELOG.md`) is updated.

---

## Cursor Cloud specific instructions

Durable, non-obvious notes for running this repo in the cloud VM. Standard commands live in the Command Palette above and `README.md`; only the gotchas are captured here. The update script already runs `pnpm install`.

### Services
- Single runnable app: `apps/web` (Next.js, `pnpm dev` -> serves on `http://localhost:3000`). Everything else under `packages/*` is a library.
- **PostgreSQL is required** and is installed natively via apt (Docker is NOT available in the VM, so `docker compose up` from the README does not work here).
- Redis is optional and unused by app code.

### PostgreSQL startup (does NOT auto-start on boot)
- Start it each session if not already running: `sudo pg_ctlcluster 16 main start`.
- Credentials match `.env` `DATABASE_URL`: user `postgres`, password `postgrespassword`, db `nusakerja_db`, on `localhost:5432`.
- The schema is applied with `pnpm db:push` (see gotcha below). Check readiness with `PGPASSWORD=postgrespassword psql -h localhost -U postgres -d nusakerja_db -c '\dt'`.

### Env loading gotcha
- The Next.js dev server auto-loads `.env`, but the DB CLI scripts do NOT. `pnpm db:push`, `pnpm db:seed`, and any `drizzle-kit`/`tsx` DB script fall back to a hardcoded REMOTE database in `packages/db/src/index.ts` unless you `export DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/nusakerja_db` first. Always export `DATABASE_URL` before running DB scripts locally.
- `.env` is gitignored; recreate with `cp .env.example .env` if missing.

### `pnpm db:push` is interactive
- `drizzle.config.ts` sets `strict: true`, so `drizzle-kit push` shows an arrow-key confirm menu ("No, abort" / "Yes, I want to execute all statements"). It HANGS when stdin is not a real TTY (piping `yes` does not work). Run it in an interactive terminal/tmux and select "Yes", or apply the generated SQL directly with `psql`.

### Known pre-existing bugs (do not block setup)
- `pnpm db:seed` fails: `packages/db/src/seed.ts` uses `schemaName` but the Drizzle field is `schema_name`, so `tenants.schema_name` inserts NULL and violates NOT NULL. Seeding is optional demo data.
- `/api/health` reports `database`/`redis` as `"connected"` statically — it is not a live connectivity check.

### App maturity (important context)
- The UI is currently a prototype: login is a client-side persona picker (`src/context/auth-context.tsx`) — any non-empty email/password works; pick a persona (e.g. HR Admin) to unlock HR actions. Employee/leave/attendance data shown in the dashboard is in-memory React state, not the DB.
- tRPC routers in `apps/web/trpc/routers/*` ARE wired to Postgres via Drizzle, but the UI does not call them yet and the tRPC context is stubbed (`createContext` returns `{ user: null, tenantId: null }`), so protected procedures reject. Employees require a `tenants` row (FK) before real DB writes will work.

### Tests
- `pnpm test` only runs a route-uniqueness check (`scripts/verify-app-routes.mjs`). There is no Vitest/Playwright suite yet despite `TESTING.md`.
