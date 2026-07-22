---
name: saas-foundation
description: >
  Create a production-ready SaaS foundation with a user-selected technology
  stack, security defaults, CI/CD, tests, and AI-agent configuration. Start by
  offering full stack options, then create or normalize the mandatory project
  context: README.md, AGENTS.md, PRODUCT.md, REQUIREMENTS.md, ARCHITECTURE.md,
  DESIGN.md, SECURITY.md, DATABASE.md, API.md, TESTING.md, DEPLOYMENT.md,
  DECISIONS.md, PROGRESS.md, and CHANGELOG.md. Use for new SaaS projects,
  project foundations, full-stack scaffolds, and existing-project context setup;
  not for a small isolated feature or script.
---

# SaaS Foundation

Build a production-grade TypeScript SaaS starter with zero compromises. When invoked,
generate the complete project structure, all config files, all knowledge continuity
docs, security hardening, CI/CD, Docker Compose, and scaffolding scripts.

## Operating baseline: secure, scalable, AI-assisted delivery

Before selecting a stack or generating files, read `reference/ai-enabled-sdlc.md`
and `reference/stack.md`. These are the governing instructions for this skill and
override any earlier fixed-tool recommendation in this file.

Build the smallest architecture that safely satisfies the approved requirements;
do not mistake more services, a monorepo, an ORM, Redis, a queue, Docker, or a
specific cloud provider for strength. Strength comes from explicit ownership,
testable requirements, risk-proportionate controls, reviewed versioned changes,
security/privacy by design, observability, tested recovery, and traceability.

Treat AI-generated code, tests, design, and documents as untrusted work product.
Never let an AI agent approve its own work, weaken a control, access unapproved
secrets/production/personal data, or independently authorise a material merge,
release, production action, or risk exception. Require independent human review
and record evidence according to the project risk class.

At project start, classify risk as A (critical), B (significant), C (standard),
or D (experimental). Create the stage-gate evidence and definition-of-ready/done
checklists in the mandatory root context files. Scale evidence and approval depth
to the class; do not remove a control without a dated, named authorised exception
in `DECISIONS.md`.

## When to invoke

- User says "create a new project", "start a SaaS", "build a foundation"
- User wants a complete starter template for a full-stack TypeScript app
- User asks for project scaffolding with auth, DB, CI/CD, and docs built-in
- User mentions "world's best foundation" or "project foundation"

## Start with technology-stack choices

Open the first user-facing response with **Technology stack options**. Give the
user the full menu below, explain that the default is a safe recommendation, and
let them choose one option per applicable layer or say **"use your recommended
stack"**. Do not silently assume the default until they choose that phrase or
decline to choose. Record every selection in `README.md`, `ARCHITECTURE.md`,
`DECISIONS.md`, and `PROGRESS.md`.

| Layer | Recommended default | Options to offer |
|---|---|---|
| Project shape | TypeScript monorepo | TypeScript monorepo, single Next.js app, React SPA + API, backend/API only, mobile + API |
| Web framework | Next.js App Router | Next.js, React + Vite, Remix, Nuxt, SvelteKit, Astro, Angular |
| Backend/API | tRPC | tRPC, REST route handlers, Hono, Fastify, NestJS, Express, GraphQL, Django/FastAPI, Laravel, Rails, Go, .NET |
| Database | PostgreSQL | PostgreSQL, MySQL, SQLite/Turso, MongoDB, DynamoDB, Supabase, Neon, PlanetScale, Firebase/Firestore |
| Data access | Drizzle | Drizzle, Prisma, Kysely, SQLAlchemy, Django ORM, TypeORM, raw SQL |
| Authentication | Auth.js | Auth.js, Clerk, Better Auth, Supabase Auth, Firebase Auth, Auth0, Cognito, Lucia-compatible custom auth |
| UI system | Tailwind + shadcn/ui | Tailwind + shadcn/ui, Radix, MUI, Ant Design, Chakra, Mantine, Park UI, CSS Modules, Panda CSS, styled-components |
| State/data fetching | React Query | React Query, SWR, Zustand, Redux Toolkit, Jotai, server-first/RSC only |
| Hosting | Vercel | Vercel, Cloudflare, Netlify, Railway, Render, Fly.io, AWS, GCP, Azure, DigitalOcean, self-hosted Docker/Kubernetes |
| Background work | BullMQ + Redis | BullMQ + Redis, Inngest, Trigger.dev, Temporal, Cloud Tasks, none |
| File storage | S3-compatible storage | S3, Cloudflare R2, Supabase Storage, UploadThing, Firebase Storage, none |
| Email | Resend | Resend, Postmark, SendGrid, AWS SES, Plunk, none |
| Payments | Stripe | Stripe, Razorpay, Paddle, Lemon Squeezy, Adyen, none |
| Observability | Sentry + Pino | Sentry, OpenTelemetry, Datadog, Better Stack, Axiom, Highlight, none |
| Test stack | Vitest + Playwright | Vitest, Jest, Bun test; Playwright, Cypress, WebdriverIO; contract/load tests if needed |
| Package manager | pnpm | pnpm, npm, yarn, Bun |

For non-TypeScript choices, keep the same context-file contract and adapt the
project structure, commands, security controls, database patterns, API format,
and tests to that stack. Do not generate TypeScript-only files for an
incompatible choice.

## Default choices vs alternatives

This foundation ships with sensible defaults. If the user wants something different,
they can swap any layer — nothing is locked in.

| Layer | Default | Alternatives they can choose |
|-------|---------|------------------------------|
| **UI library** | shadcn/ui (Radix-based, Tailwind) | Radix Primitives direct, MUI, Ant Design, Chakra, Park UI |
| **API layer** | tRPC v11 (end-to-end type safety) | Hono (edge-native), Next.js API Routes (simpler), Express/Fastify (traditional) |
| **Auth** | NextAuth v5 | Lucia v3, Clerk, Auth0, Supabase Auth |
| **ORM** | Drizzle ORM | Prisma, Kysely, TypeORM |
| **CSS** | Tailwind CSS v4 | Panda CSS, vanilla CSS modules, styled-components |
| **Package manager** | pnpm | npm, yarn, bun |
| **AI platform** | Claude Code | OpenClaw / Hermes, Codex, Anti-Gravity, Cursor, Windsurf, generic LLM |

Each AI platform gets its own agent configuration file generated in the project:

| If platform is... | Creates | So the AI knows... |
|-------------------|---------|-------------------|
| Claude Code (default) | `CLAUDE.md` | Stack, commands, conventions, security rules |
| OpenClaw / Hermes | `soul.md` + `user.md` | Agent identity + user preferences |
| Codex / Anti-Gravity | `agent.md` | Agent behavior, tools, and security checklist |
| Cursor / Windsurf | `CLAUDE.md` | Same as Claude Code — Cursor/Windsurf read `.claude/` configs |
| Generic / any LLM | `CLAUDE.md` + `agent.md` | Combined instructions for maximum compatibility |

If the user says nothing about these, use the defaults. If they ask for an alternative,
substitute it during generation — the architecture stays the same.

## Before you start

After presenting the technology-stack menu, ask only the unanswered questions.
Omit any that the user already answered:

1. **Project name** (kebab-case, e.g., `my-saas`)
2. **Technology stack**: choose one option per relevant layer above, or approve the recommended stack.
3. **Deployment target**: choose a hosting option above, or defer it.
4. **AI platform**: Claude Code (default), OpenClaw / Hermes, Codex, Anti-Gravity, Cursor, Windsurf, or generic?

If they say "surprise me" or "your call" on any question, use the default.
Use the AI platform answer to determine which agent configuration file(s) to
generate in Phase 5.

Before scaffolding, write a concise task brief in `PROGRESS.md`, then establish
these evidence-based gates in the root context files: G1 business approval,
G2 requirements approval, G3 design/risk approval, G4 build complete, G5 quality
and security approval, G6 release approval, and G7 go-live acceptance. A named
human owner is accountable for each applicable gate. For a new project, G1-G3
must be materially complete before production implementation; for an incremental
change, use the gates proportionately to its risk class.

## Execution phases

Execute these phases **in order**. Each phase must complete fully before the next begins.

---

### Phase 0 — Scaffold project skeleton

Use the following structure only for the selected TypeScript monorepo profile.
For a single application or a non-TypeScript stack, generate the equivalent
minimal structure and keep the same root context, security, testing, deployment,
and evidence contract. Do not create unused services or packages.

Create directory structure:

```
<project-name>/
├── apps/
│   └── web/                    # Next.js 16 App Router
├── packages/
│   ├── ui/                     # Shared UI (shadcn/ui)
│   ├── db/                     # Drizzle schema + migrations
│   ├── auth/                   # Auth config + middleware
│   ├── validators/             # Shared Zod schemas
│   ├── email/                  # React Email templates
│   └── config/                 # Env, constants, shared config
├── tooling/
│   ├── eslint/                 # Shared ESLint flat config
│   └── typescript/             # Shared tsconfig bases
├── scripts/                    # Scaffolding CLI
├── .github/
│   └── workflows/
│       ├── ci.yml              # lint → typecheck → test → build
│       └── cd.yml              # Deploy (conditional)
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml      # Postgres + Redis + app
├── docs/
│   ├── memory.md
│   ├── progress.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── SECURITY.md
│   ├── CONTRIBUTING.md
│   └── ADR/
│       └── adr-template.md
├── README.md                   # Product overview and quick start
├── AGENTS.md                   # Rules for AI agents and contributors
├── PRODUCT.md                  # Product vision, users, scope, success metrics
├── REQUIREMENTS.md             # Functional and non-functional requirements
├── ARCHITECTURE.md             # System design and boundaries
├── DESIGN.md                   # Design system and UX rules
├── SECURITY.md                 # Security model and operational controls
├── DATABASE.md                 # Data model, migrations, retention and access
├── API.md                      # API contract, auth, errors and versioning
├── TESTING.md                  # Test strategy, commands and release gates
├── DEPLOYMENT.md               # Environments, rollout, rollback and runbooks
├── DECISIONS.md                # Architecture decision log
├── PROGRESS.md                 # Current plan, status, blockers and next work
└── CHANGELOG.md                # User-facing release history
├── CLAUDE.md                   # Platform: Claude Code / Cursor / Windsurf
├── soul.md                     # Platform: OpenClaw / Hermes (agent identity)
├── user.md                     # Platform: OpenClaw / Hermes (user profile)
├── agent.md                    # Platform: Codex / Anti-Gravity (agent config)
├── .env.example
├── .gitignore
├── package.json                # Root (pnpm workspace)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json               # Base tsconfig
├── vitest.workspace.ts
└── playwright.config.ts
```

After creating directories, write every file. Use matching coding style — modern, no comments
unless critical, concise.

---

### Phase 1 — Core infrastructure

**1a. Root config files**

- `package.json` — name matches `<project-name>`, private, scripts: dev/build/lint/typecheck/test
- `pnpm-workspace.yaml` — packages: `apps/*` `packages/*` `tooling/*`
- `turbo.json` — pipeline: dev, build, lint, test, typecheck with cache outputs
- `tsconfig.json` — base: strict, ESNext module, bundler resolution, paths
- `vitest.workspace.ts` — include all packages
- `playwright.config.ts` — webServer pointing to `apps/web`, test dir `apps/web/e2e`

**1b. Database (`packages/db`)**

- Drizzle config: PostgreSQL, schema in `src/schema/`
- Initial schema files:
  - `users.ts` — id (uuid), email, name, avatar_url, role (enum: admin/user/viewer), created_at, updated_at
  - `sessions.ts` — id, user_id (FK), expires_at, created_at
  - `audit_logs.ts` — id, user_id, action, resource, details (jsonb), ip_address, created_at
- `drizzle.config.ts` — schema path, output path
- `src/index.ts` — re-export all schemas + `db` client

**1c. Auth (`packages/auth`)**

If NextAuth v5:
- Drizzle adapter
- Providers: Google + Credentials (email/password)
- Session strategy: database
- Pages: signin, error
- Callbacks: session user includes role

If Lucia v3:
- Drizzle adapter
- Session table in Drizzle
- Password hashing with Argon2
- Login/signup/verify API handlers
- Middleware for session verification

**1d. Validators (`packages/validators`)**

- `src/auth.ts` — signup schema, login schema, profile update schema
- `src/common.ts` — pagination, UUID, email
- `src/index.ts` — re-exports

**1e. Config (`packages/config`)**

- `src/env.ts` — Zod-validated env vars (DATABASE_URL, AUTH_SECRET, etc.)
- `src/constants.ts` — app name, pagination defaults, cookie names

**1f. Web app (`apps/web`)**

- Next.js 16 with App Router
- If the user chose an alternative API layer (Hono, Next.js API Routes), use that instead of tRPC
- If the user chose an alternative UI library (MUI, Chakra, etc.), use that instead of shadcn/ui
- `app/layout.tsx` — providers (API, Auth, Theme)
- `app/page.tsx` — landing page (redirects to dashboard if authed)
- `app/(auth)/login/page.tsx` — login form
- `app/(auth)/signup/page.tsx` — signup form
- `app/(dashboard)/layout.tsx` — sidebar + header layout
- `app/(dashboard)/page.tsx` — dashboard home
- `app/api/trpc/[trpc]/route.ts` — tRPC HTTP handler
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler (if NextAuth)
- `trpc/` — router, context, procedures
- `components/` — ui components from shadcn
- `e2e/` — Playwright tests (auth flow)

**1g. API layer (tRPC by default)**

If the user chose **tRPC** (default):
- Root router in `packages/` or `apps/web/trpc/`
- Context: auth session, db, request ID
- Public procedure: no auth required
- Protected procedure: auth + role check
- Error formatter: Zod errors → field-level messages

If the user chose **Hono**:
- Routes in `apps/web/app/api/` using Hono's router
- Middleware for auth, rate limiting, CORS
- Zod validation on every route
- OpenAPI docs via `@hono/zod-openapi`

If the user chose **Next.js API Routes**:
- Routes in `apps/web/app/api/` using Route Handlers
- Middleware at `apps/web/src/middleware.ts`
- Zod validation per route

**1h. Docker Compose**

- `docker-compose.yml`:
  - `postgres` — PostgreSQL 16, port 5432, volume for data
  - `redis` — Redis 7, port 6379 (for rate limiting / queues)
  - `app` — builds from Dockerfile, depends on postgres+redis

**1i. Design system (`docs/DESIGN.md`)**

Write `docs/DESIGN.md` from the `templates/DESIGN.md` template. Customize the
brand palette to the project name (auto-generate a complementary 50-900 scale).
Implement all tokens as CSS custom properties in `app/globals.css` and Tailwind
extensions in `tailwind.config.ts`. See `reference/design-guide.md` for the
implementation roadmap, component composition patterns, and anti-patterns.

Design system must include:
- Brand + semantic color palette (light and dark)
- Type scale (display through caption) with Inter + JetBrains Mono
- Spacing scale, border radius, shadow tokens
- Motion tokens with `prefers-reduced-motion` respect
- Layout system (sidebar + main, responsive breakpoints)
- Component tier architecture (primitives → composed → feature)
- Form patterns (react-hook-form + Zod + shadcn/ui)
- State patterns (loading, empty, error, edge)
- Accessibility baseline (WCAG AA, keyboard nav, focus rings)
- Dark mode implementation (class-based, localStorage persistence)
- Iconography conventions (lucide-react, inheritance)

**1j. UI (`packages/ui`)**

If the user chose an alternative UI library, use that instead of shadcn/ui.

- shadcn/ui initialized with `components.json`
- Base components: Button, Input, Card, Dialog, DropdownMenu, Table, Badge, Skeleton, Avatar, Sonner/Toast
- All using Tailwind CSS v4 + class-variance-authority

---

### Phase 2 — Security hardening

Apply **all** of these. No exceptions.

| Check | Implementation |
|-------|---------------|
| CSP headers | Next.js middleware or `next.config.js` headers |
| Helmet security headers | Same middleware: X-Content-Type-Options, X-Frame-Options, Referrer-Policy |
| CORS | Whitelist origins in config, apply in tRPC middleware |
| Rate limiting | Upstash Ratelimit or Vercel KV — per IP for auth routes, per user for API |
| RBAC | `role` field on user, middleware checks: `requireRole('admin')` |
| Input validation | Every tRPC mutation uses Zod schema from `@validators` |
| SQL injection | Drizzle ORM — parameterized by default |
| XSS | React auto-escapes + CSP prevents inline scripts |
| Secrets | `.env` gitignored, `.env.example` committed with dummy values |
| Audit logging | All sensitive actions → `audit_logs` table (login, role change, data export) |
| Session rotation | Rotate session ID on login, logout, role upgrade |
| Brute force protection | Lockout after 5 failed attempts for 15 minutes |
| Password policy | Min 8 chars, 1 upper, 1 number (enforced in validators) |
| API key format | `sk_<project>_<random>` — prefix-identifiable |
| Dependency scanning | `pnpm audit` in CI + Dependabot weekly |

Write the security middleware in `apps/web/src/middleware.ts`:

```typescript
// Security middleware must:
// 1. Apply CSP + Helmet headers to all responses
// 2. Rate-limit auth routes by IP
// 3. Rate-limit API routes by user session
// 4. Log all 401/403 responses to audit_logs
```

---

### Phase 3 — Operational excellence

**3a. Testing**

- `vitest.config.ts` at root — coverage threshold 80%
- Unit tests: `packages/*/src/**/__tests__/` — cover validators, auth helpers, utilities
- Integration tests: `packages/db/src/__tests__/` — test DB queries with test container
- E2E: `apps/web/e2e/` — Playwright: signup flow, login flow, protected route redirect, 404 page
- CI pipeline runs: `pnpm lint && pnpm typecheck && pnpm test -- --coverage`

**3b. Logging**

- Pino logger in `packages/config/src/logger.ts`
- Request ID on every request (via middleware)
- Structured JSON logging: `{ level, time, msg, req_id, user_id, path, duration_ms }`
- Log level: `debug` in dev, `info` in prod

**3c. Error handling**

- Centralized error handler in tRPC
- Custom error classes: `NotFoundError`, `UnauthorizedError`, `ValidationError`, `RateLimitError`
- Dev: full error details. Prod: sanitized messages, logged to Sentry.

**3d. Health checks**

- `GET /api/health` returns:
  ```json
  { "status": "ok", "db": "connected", "redis": "connected", "uptime": 12345 }
  ```
- Run every 30s in Docker Compose via healthcheck

**3e. CI/CD**

- `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    quality:
      runs-on: ubuntu-latest
      services:
        postgres:
          image: postgres:16
          env: { POSTGRES_PASSWORD: postgres }
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
        - run: pnpm install
        - run: pnpm lint
        - run: pnpm typecheck
        - run: pnpm test -- --coverage
        - run: pnpm build
  ```
- `.github/workflows/cd.yml` — deploy to Vercel (web) + Docker registry (API)

---

### Phase 4 — Scaffolding scripts

Create `scripts/scaffold.ps1` with commands:

| Command | What it generates |
|---------|------------------|
| `pnpm scaffold model <name>` | Drizzle schema + Zod validator + tRPC router |
| `pnpm scaffold page <name>` | Next.js page + loading + error states |
| `pnpm scaffold feature <name>` | Full vertical slice: model + page + API + tests |
| `pnpm scaffold email <name>` | React Email template + preview route |

Each scaffold must:
- Respect existing conventions (path naming, exports, file structure)
- Wire imports correctly into existing modules
- Not overwrite existing files unless `--force` is passed

---

### Phase 5 — Knowledge continuity files

Write each file using templates in `templates/`. Customize:
- Replace `<project-name>` with the actual project name
- Replace `<year>` with the current year
- Fill in any choices the user made (auth provider, etc.)

Files to write — **always write the universal files** (memory.md, progress.md,
ARCHITECTURE.md, DESIGN.md, SECURITY.md, CONTRIBUTING.md, ADR/). Then write the
**platform-specific agent config file(s)** based on the user's AI platform choice.

### Mandatory project context files (always create or normalize)

Use the templates in `templates/context/` to create every mandatory root context
file. Replace placeholders with the project name, current date/year, and selected
technology stack. The result must be useful immediately: put the selected stack,
known assumptions, first deliverable, and next concrete action in the files; do
not leave a blank documentation shell.

If the target is an existing project, inspect each mandatory file before changing
it. Keep valuable project-specific content, normalize it into the template's
headings, and add only missing sections. Never overwrite a populated file with a
generic template. When a fact is unknown, write `TBD — validate` and add it to
`PROGRESS.md`; do not invent it. Preserve an existing `CHANGELOG.md` history and
append a dated `Unreleased` entry rather than rewriting prior releases.

| File | Purpose | Minimum working content |
|---|---|---|
| `README.md` | Executive project overview and local start path | value proposition, selected stack, prerequisites, run/test commands, links to every context file |
| `AGENTS.md` | Operating rules for AI agents and contributors | repo map, non-negotiable rules, commands, security boundaries, documentation update rule |
| `PRODUCT.md` | Product direction | problem, users, jobs, scope, non-goals, success metrics, first milestone |
| `REQUIREMENTS.md` | Build contract | prioritized functional requirements, non-functional requirements, acceptance criteria, out-of-scope list |
| `ARCHITECTURE.md` | Technical blueprint | selected stack, component/data flow, boundaries, repository layout, key trade-offs |
| `DESIGN.md` | UX and visual system | users and journeys, design principles, tokens, accessibility, responsive and state rules |
| `SECURITY.md` | Security baseline | data classification, auth/authz, validation, secrets, threat controls, incident response and review checklist |
| `DATABASE.md` | Data contract | chosen datastore, entity/index plan, migrations, tenancy, access, backups/retention |
| `API.md` | Interface contract | API style, base URL/versioning, auth, error envelope, endpoint/event inventory, idempotency/rate limits |
| `TESTING.md` | Quality plan | test pyramid, environments/fixtures, commands, coverage targets, release gates and critical journeys |
| `DEPLOYMENT.md` | Delivery runbook | environments, configuration/secrets, CI/CD, rollout, smoke checks, monitoring and rollback |
| `DECISIONS.md` | Decision log | decision record format plus the initial selected-stack decision and future decision index |
| `PROGRESS.md` | Live execution board | current phase/status, checked initial context task, next actions, risks/blockers and update log |
| `CHANGELOG.md` | Release history | Keep a Changelog format, an `Unreleased` section, and the initial foundation entry |

Keep legacy `docs/memory.md`, `docs/progress.md`, `docs/ARCHITECTURE.md`,
`docs/DESIGN.md`, `docs/SECURITY.md`, `docs/CONTRIBUTING.md`, and `docs/ADR/`
only when they already exist or the user asks for them. Make root files canonical
and add links rather than maintaining conflicting duplicate sources of truth.

### Agent configuration files (platform-dependent)

Generate one of these based on the user's AI platform answer:

| If user chose... | Write this file | Purpose | From template |
|------------------|----------------|---------|---------------|
| Claude Code (default) | `CLAUDE.md` | Stack, commands, conventions, security rules | `templates/CLAUDE.md` |
| OpenClaw / Hermes | `soul.md` + `user.md` | Agent identity + user preferences | `templates/soul.md` + `templates/user.md` |
| Codex / Anti-Gravity | `agent.md` | Agent behavior, tools, security checklist | `templates/agent.md` |
| Cursor / Windsurf | `CLAUDE.md` | Cursor/Windsurf read `.claude` configs | `templates/CLAUDE.md` |
| Generic / any LLM | `CLAUDE.md` + `agent.md` | Maximum compatibility across platforms | `templates/CLAUDE.md` + `templates/agent.md` |

Each platform-specific file tells the AI agent how to behave, what tools to use,
and what conventions to follow. Together with the universal docs, they ensure
every session starts with full context regardless of which platform the user
works on.

### Universal files (written for every project)

1. **`docs/memory.md`** — Session-level context store. Records project metadata,

2. **`docs/memory.md`** — Session-level context store. Records project metadata,
   architecture decisions (with ADR links), key dependencies, date-stamped session
   notes, known issues, and environment details. The AI reads this at every session
   start to resume context. Humans read it for history and onboarding. **Must be
   updated at the end of every work session** with a new session note entry.

3. **`docs/progress.md`** — Milestone and task tracker. Contains Phase 0-6 checklists
   (all marked pending on creation), a status overview table, completed milestones
   log, blockers table, and "next up" section. The AI reads this to know where work
   left off. Humans use it for standups and planning. **Checkboxes are ticked as
   work completes. Blockers are added as they arise.** The progress.md file in the
   skill itself serves double duty: it tracks the project foundation and also works
   as documentation for the skill's generation process.

4. **`docs/ARCHITECTURE.md`** — System design overview. Shows how Next.js, tRPC,
   Drizzle, PostgreSQL, and Redis connect. Defines the data model (users, sessions,
   audit_logs), request flow, security boundaries, and package dependency graph.
   Updated when the architecture changes significantly.

5. **`docs/DESIGN.md`** — Design system specification. Brand palette, semantic
   colors (light + dark), type scale, spacing, border radius, shadows, motion,
   layout system, component tiers, state patterns, form patterns, accessibility
   baselines, dark mode implementation, iconography, and coding conventions.
   Updated when brand or UI patterns change.

6. **`docs/SECURITY.md`** — Security model document. Auth method, RBAC roles, rate
   limits, CSP/Helmet headers, data protection, audit logging, dependency security,
   and incident response. Updated when security posture changes.

7. **`docs/CONTRIBUTING.md`** — Developer onboarding guide. Step-by-step setup,
   8-step development workflow, code conventions, testing conventions, and PR
   checklist. Every new developer or AI agent reads this first.

8. **`docs/ADR/adr-template.md`** — Architecture Decision Record template. Used to
   create individual ADR files (`adr-001-*.md`) for every significant architectural
   decision. Copy the template to a new file, fill it out, and commit alongside
   the decision's code changes.

---

### Phase 6 — Final verification

Run these checks before declaring done:

```
01. [ ] pnpm install completes without errors
02. [ ] pnpm lint passes (ESLint flat config)
03. [ ] pnpm typecheck passes (tsc --noEmit)
04. [ ] pnpm test runs and passes (Vitest)
05. [ ] docker compose build succeeds
06. [ ] .env.example has no real secrets
07. [ ] .gitignore covers: node_modules, .env, dist, .next, *.log
08a. [ ] Universal docs exist: memory.md, progress.md, ARCHITECTURE.md,
         DESIGN.md, SECURITY.md, CONTRIBUTING.md, ADR/adr-template.md
08b. [ ] All mandatory root context files exist, use the selected stack, and have no unresolved placeholder except explicit `TBD — validate` items tracked in PROGRESS.md
08c. [ ] Platform config exists: CLAUDE.md OR soul.md+user.md OR agent.md
         (matching user's AI platform choice)
09. [ ] middleware.ts applies CSP + Helmet headers
10. [ ] Health endpoint returns 200 + JSON with status fields
11. [ ] Auth flow works: signup → login → protected route
```

## Output format

When completed, return:

```
## Project created: <project-name>

### Structure
- <n> directories, <n> files

### Stack
- Frontend: Next.js 16 + Tailwind + shadcn/ui
- Design system: Token-based (light/dark), Inter + JetBrains Mono, responsive grid
- Backend: tRPC + Drizzle ORM + PostgreSQL
- Auth: <NextAuth v5 | Lucia v3>
- AI platform: <Claude Code | OpenClaw | Codex | Anti-Gravity | Cursor | generic>
- Queue: BullMQ + Redis
- Test: Vitest + Playwright
- CI: GitHub Actions

### Security
- CSP | Helmet | Rate limiting | RBAC | Zod validation | Audit logging
- Brute force protection | Session rotation | Dependency scanning

### Quick start
- `pnpm install`
- `cp .env.example .env` and fill values
- `docker compose up -d`
- `pnpm db:push`
- `pnpm dev`

### Next steps
- [Anything the user should do next, e.g., configure OAuth keys]
```

## Anti-patterns

- **Don't** add features beyond what's listed. The foundation is minimal.
- **Don't** skip security measures because "it's just a starter". Every measure is non-negotiable.
- **Don't** write placeholder comments like "TODO: add your logic here". Write complete files.
- **Don't** use `any` types. Every type must be explicit.
- **Don't** over-abstract. Single-use functions should not be in shared packages.
- **Don't** create the project in the current directory without asking for a project name first.
- **Don't** generate files that duplicate existing templates — use the provided templates.

## Scope boundary

This skill generates a NEW project from scratch. It does NOT:
- Modify an existing project's application structure or business logic. It may create or normalize the mandatory root context files in an existing project while preserving its content.
- Add features to an already-running codebase
- Handle deployment to specific cloud providers (Vercel/Docker deployment in CI/CD is a stub)
- Generate business logic for a specific domain (CRM, analytics, etc.)
- Replace an existing project's configuration
