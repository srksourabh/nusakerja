# Memory — <project-name>

> Project context and decision log. Updated at the end of every session.
> AI agents read this at session start to resume context.
>
> Agent config lives in: `CLAUDE.md` (Claude/Cursor), `soul.md` + `user.md`
> (OpenClaw/Hermes), or `agent.md` (Codex/Anti-Gravity).

## Project metadata
- **Created**: <date>
- **Stack**: Next.js 16 + tRPC + Drizzle + PostgreSQL
- **Auth**: <auth-provider>
- **Deployment**: Vercel (web) / Docker (services)
- **Repository**: [repo URL]

## Architecture decisions

Chronological log of significant decisions. Each entry links to a full ADR
in `docs/ADR/` for deeper context.

### ADR-001: Auth strategy
**Date**: <date>
**Decision**: <auth-provider>
**Reason**: Standard choice for TypeScript SaaS — good developer experience,
out-of-the-box OAuth support, self-hosted (no vendor lock-in).
**Trade-offs**: Must manage session invalidation ourselves; less feature-rich
than managed providers like Clerk or Auth0.
**Link**: `docs/ADR/adr-001-auth-strategy.md`

### ADR-002: Database ORM
**Date**: <date>
**Decision**: Drizzle ORM
**Reason**: Lightweight, SQL-like API, good TypeScript inference, fast
migrations (no engine binary). Prisma has better DX for complex relations
but is significantly heavier.
**Trade-offs**: Less mature relation handling than Prisma; more SQL knowledge
required. More control over queries.
**Link**: `docs/ADR/adr-002-database-choice.md`

### ADR-003: Monorepo tool
**Date**: <date>
**Decision**: Turborepo + pnpm
**Reason**: Industry standard for TypeScript monorepos, parallel execution,
caching. Lighter and faster than Nx for a SaaS starter.
**Trade-offs**: Nx has more advanced code generation; Turborepo requires
manual task configuration.
**Link**: `docs/ADR/adr-003-monorepo-tooling.md`

## Key dependencies

| Dependency | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router (RSC, layouts, server actions) |
| tRPC v11 | End-to-end type-safe API layer (no schema duplication) |
| Drizzle ORM | Database access with full TypeScript inference |
| Tailwind CSS v4 | Utility-first styling (CSS-first config) |
| shadcn/ui | Accessible component library (Radix UI + Tailwind) |
| Zod | Runtime schema validation + TypeScript inference |
| Pino | Structured JSON logging |
| BullMQ | Background job queue (Redis-based) |
| Resend | Email delivery (React Email templates) |

## Session notes

> Add a new entry at the end of every session in the format below.
> AI agents: before starting work, read the latest entry to understand
> where the previous session left off.

### <YYYY-MM-DD>: <Summary of what was done>
- **Work done**: [describe features built, bugs fixed, decisions made]
- **Files touched**: [list files created or modified]
- **Decisions**: [any ADRs created or design choices made]
- **Blockers**: [anything blocking progress]
- **State**: [current status of ongoing work]
- **Next**: [what should be worked on next session]

<!-- Example:
### 2026-07-12: Implemented authentication flow
- Work done: Set up NextAuth v5 with Google OAuth + email/password
- Files touched: packages/auth/, apps/web/app/(auth)/, packages/db/src/schema/users.ts
- Decisions: Using database sessions (not JWT) for better control
- Blockers: Need Google API credentials from admin
- State: Auth works locally. Signup form complete. Email verification pending.
- Next: Wire up Resend for welcome emails, add password reset flow
-->

## Known issues

| Issue | Status | Notes |
|-------|--------|-------|
| [description] | open/in progress/resolved | [context or PR link] |

## Environment

| Environment | URL / Command | Notes |
|-------------|---------------|-------|
| **Dev** | `docker compose up` | Postgres + Redis, auto-migrate |
| **Staging** | [staging URL] | [deployment notes] |
| **Production** | [prod URL] | [deployment notes] |
