# Progress — <project-name>

> Task and milestone tracker. Updated whenever work completes or blockers arise.
> AI agents: read this at session start to know where work left off.
>
> Agent config lives in: `CLAUDE.md` (Claude/Cursor), `soul.md` + `user.md`
> (OpenClaw/Hermes), or `agent.md` (Codex/Anti-Gravity).

## Status overview

| Phase | Progress | Status |
|-------|----------|--------|
| 0 — Project skeleton | [ ] / [x] | pending / in progress / complete |
| 1 — Core infrastructure | [ ] / [x] | pending / in progress / complete |
| 2 — Security hardening | [ ] / [x] | pending / in progress / complete |
| 3 — Operational excellence | [ ] / [x] | pending / in progress / complete |
| 4 — Scaffolding scripts | [ ] / [x] | pending / in progress / complete |
| 5 — Knowledge files | [ ] / [x] | pending / in progress / complete |
| 6 — Final verification | [ ] / [x] | pending / in progress / complete |
| **Overall** | **N of 34 tasks done** | **in progress** |

---

## Phase 0 — Project skeleton
> Directory structure, root config files, git setup.
- [ ] Directory structure created (all directories in place)
- [ ] Root config files written (package.json, turbo.json, tsconfig, vitest, playwright)
- [ ] .gitignore covers: node_modules, .env, dist, .next, *.log
- [ ] .env.example written with all required variables documented

## Phase 1 — Core infrastructure
> Database, auth, API layer, web app, Docker, design system, UI components.
- [ ] Database schema: users, sessions, audit_logs (Drizzle ORM)
- [ ] Auth setup: <auth-provider> with OAuth + email/password
- [ ] API layer: tRPC (or Hono / API Routes) with public + protected routes
- [ ] Validators: Zod schemas for auth, common (pagination, UUID, email)
- [ ] Config: env validation, constants, custom error classes, logger
- [ ] Next.js app: layout, landing page, auth pages, dashboard shell
- [ ] Design: tokens, type scale, colors, spacing, dark mode (docs/DESIGN.md)
- [ ] Docker Compose: Postgres 16 + Redis 7 + app
- [ ] shadcn/ui: base components initialized

## Phase 2 — Security hardening
> All protections applied. No exceptions.
- [ ] CSP + Helmet security headers (middleware.ts)
- [ ] CORS whitelist (origins in config, applied in API layer)
- [ ] Rate limiting: 10 req/s per IP for auth, 100 req/s per user for API
- [ ] RBAC middleware: admin / user / viewer role enforcement
- [ ] Audit logging: all sensitive operations → audit_logs table
- [ ] Session rotation: on login, logout, and role upgrade
- [ ] Brute force protection: 5 failed attempts → 15-minute lockout

## Phase 3 — Operational excellence
> Testing, logging, error handling, health checks, CI/CD.
- [ ] Vitest unit + integration tests (coverage >= 80%)
- [ ] Playwright E2E tests (auth flow, protected routes, 404)
- [ ] Pino structured logging with request IDs
- [ ] Centralized error handler with custom error classes
- [ ] Health check endpoint: GET /api/health → { status, db, redis, uptime }
- [ ] CI pipeline: GitHub Actions (lint → typecheck → test → build)

## Phase 4 — Scaffolding scripts
> Code generation CLI for rapid feature development.
- [ ] Model generator (pnpm scaffold model <name>)
- [ ] Page generator (pnpm scaffold page <name>)
- [ ] Feature generator (pnpm scaffold feature <name>)
- [ ] Email generator (pnpm scaffold email <name>)

## Phase 5 — Knowledge continuity files
> All documentation generated from templates.
- [ ] CLAUDE.md (per-project AI instructions)
- [ ] docs/memory.md (session context + decision log)
- [ ] docs/progress.md (this file — milestone tracking)
- [ ] docs/ARCHITECTURE.md (system design + data model)
- [ ] docs/DESIGN.md (design system tokens + conventions)
- [ ] docs/SECURITY.md (security model + incident response)
- [ ] docs/CONTRIBUTING.md (setup + contribution workflow)
- [ ] docs/ADR/adr-template.md (Architecture Decision Record template)

## Phase 6 — Final verification
> Every check must pass before declaring the foundation complete.
- [ ] pnpm install completes without errors
- [ ] pnpm lint passes (ESLint flat config)
- [ ] pnpm typecheck passes (tsc --noEmit)
- [ ] pnpm test runs and passes (Vitest)
- [ ] docker compose build succeeds
- [ ] .env.example has no real secrets
- [ ] Health endpoint returns 200 + JSON with status fields
- [ ] Auth flow works: signup → login → protected route

---

## Completed milestones

> Mark off completed work here. Each row is a significant milestone.

| Date | Milestone | Notes |
|------|-----------|-------|
| —    | —         | —     |

## Blockers

> Track anything blocking progress. Update status when resolved.

| Date | Blocker | Affects | Status |
|------|---------|---------|--------|
| —    | —       | —       | —      |

## Next up

> Briefly note what should be tackled next. Updated at session end.

- [ ] <!-- next task -->
- [ ] <!-- follow-up task -->
