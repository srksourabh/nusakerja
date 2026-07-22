# Technology selection guide

No component is mandatory merely because it is popular. Start with the product,
risk class, team capability, integration constraints, expected scale, operating
model, cost, and exit path. Record the selected option and alternatives in
`DECISIONS.md` before implementation.

## Recommended TypeScript web profile

For a new, conventional SaaS with a TypeScript-capable team, start evaluation
with: Next.js App Router, PostgreSQL, a managed auth provider or Auth.js,
Tailwind plus an accessible component system, Vitest, Playwright, structured
logs, error monitoring, CI/CD, and versioned SQL migrations. Use a monorepo,
tRPC, Redis, queues, Docker, and additional services only when an actual need
justifies their operational cost.

This is a starting profile, not an architecture decision. A single application
with well-defined modules is normally safer than a premature monorepo or
microservices. Split components only for an independently justified deployment,
ownership, scaling, security, or runtime boundary.

## ORM and migration decision

An ORM is optional. What is mandatory is a reviewed, version-controlled,
production-safe migration workflow; database constraints; query performance
evidence for critical paths; backups; restore testing; and a rollback/forward-fix
plan.

| Option | Prefer when | Do not choose by default when |
|---|---|---|
| Drizzle + SQL migrations | TypeScript team wants SQL-shaped code, direct control, PostgreSQL, and a lightweight abstraction | the team needs a highly declarative model-first workflow or lacks comfort reviewing SQL |
| Prisma + Prisma Migrate | team values generated client and declarative model workflow; schema is primarily application-managed | database has extensive database-native behaviour or the generated-client workflow is not a fit |
| Kysely / query builder + SQL migrations | team wants strong TypeScript typing with explicit SQL and independent migrations | the team needs a full ORM and will not own SQL/query design |
| SQL-first migrations + thin driver | complex reporting, extensions, stored procedures, strict database ownership, or polyglot services | team lacks database review discipline or needs faster product-level CRUD iteration |
| Supabase / hosted data platform | managed auth/storage/realtime and platform constraints fit the product | its operational and portability trade-offs are not accepted |

Drizzle is therefore a **recommended option**, not a requirement. Its official
documentation supports versioned SQL migrations and PostgreSQL drivers; Prisma
also produces version-controlled SQL migrations and is a valid scalable choice.
Choose one data-access path per bounded context and do not mix tools casually.

## Other selection checkpoints

| Concern | Default starting point | Escalate or switch when |
|---|---|---|
| Project shape | single deployable application | multiple independently owned/deployed systems have a proven need |
| API | route handlers or tRPC for a TypeScript-only client | public/partner APIs, multi-language clients, streaming/edge needs, or formal API contracts favour REST/OpenAPI, GraphQL, Hono, or another option |
| Authentication | managed provider or Auth.js with server-side authorization | enterprise SSO, regulatory controls, multi-region identity, or implementation speed changes the trade-off |
| Queue/cache | none initially | long-running, scheduled, high-volume, rate-limited, or resilient background work is accepted and has an owner |
| Observability | structured logs, health checks, error tracking | SLOs, distributed flows, regulated audit, or high scale justify metrics/traces/on-call tooling |
| Hosting | managed platform with least operational burden | geography, compliance, networking, cost, long-running processes, or infrastructure control requires a different platform |

## Non-negotiable implementation rules

- Pin and review dependencies; evaluate licence, vulnerability, maintenance, and
  ownership before adding one.
- Keep architecture diagrams, database/API contracts, tests, deployment runbook,
  and decision records aligned with the selected stack.
- Test migrations against representative data and use expand-migrate-contract or
  another compatible strategy for breaking production data changes.
- Revisit a decision when assumptions, cost, load, team capability, incidents, or
  vendor terms materially change.
