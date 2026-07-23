# PROGRESS.md — NusaKerja Master Task & Production Readiness Tracker

> Status: Foundation, 13 application routes, database migration, CI, and Vercel production deployment are operational. Live-data integration and full automated test coverage remain pending launch work.

## Latest Verified Release — 2026-07-23

- Production: `https://nusakerja.vercel.app` — HTTP 200 verified.
- Production dashboard: `/dashboard` — HTTP 200 verified.
- Health endpoint: `/api/health` — application, PostgreSQL, and Redis report connected.
- GitHub `main`: commit `61e712b`; local and remote branches synchronized.
- GitHub Actions: lint, typecheck, route tests, and production build all pass.
- Database: committed Drizzle migrations applied successfully.
- App Router: 13 unique application pages validated on `main`.

---

## 1. Completed Core Engineering Phases (`Phases 0–5`)

- [x] **Phase 0: Project Scaffold & Monorepo Foundation**
  - TypeScript monorepo with `pnpm` workspaces, Turbo pipelines, `package.json`, `tsconfig.json`, `docker-compose.yml`, `.env.example`, `.gitignore`.
- [x] **Phase 1: Core Infrastructure Packages**
  - `@nusakerja/db`: Drizzle ORM PostgreSQL schema-per-tenant (`tenants`, `users`, `sessions`, `employees`, `leave_requests`, `attendance_punches`, `statutory_parameters`, `payroll_runs`, `payroll_items`, `document_vault`, `audit_logs`).
  - `@nusakerja/auth`: Auth.js v5 multi-tenant RBAC (`super_admin`, `reseller_admin`, `client_admin`, `hr_admin`, `payroll_admin`, `manager`, `employee`).
  - `@nusakerja/validators`: Zod schemas for NIK (16-digit), NPWP (15/16-digit), BPJS TK (11-digit), BPJS KS (13-digit), PTKP status, and auth.
  - `@nusakerja/config`: Zod env validation, Pino JSON logger, and effective-dated statutory calculation engine.
  - `@nusakerja/ui`: Merah-Putih themed Tailwind CSS v4 + shadcn/ui components (`Button`, `Card`, `Badge`).
- [x] **Phase 2: Security & Privacy Hardening**
  - CSP headers, Helmet headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`), RBAC enforcement, session rotation, and audit logging in `apps/web/src/middleware.ts`.
- [x] **Phase 3: Operational Excellence**
  - Pino logger, health probe `GET /api/health`, and GitHub Actions CI workflow `.github/workflows/ci.yml`.
- [x] **Phase 4: Scaffolding Tools**
  - PowerShell CLI generator `scripts/scaffold.ps1`.
- [x] **Phase 5: Knowledge Context Docs & Agent Configs**
  - All 14 root context files created (`README.md`, `AGENTS.md`, `PRODUCT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, `SECURITY.md`, `DATABASE.md`, `API.md`, `TESTING.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `PROGRESS.md`, `CHANGELOG.md`).
  - Agent blueprints: `agent.md` (Anti-Gravity) & `CLAUDE.md` (Claude Code / Cursor).
- [x] **Phase 6: Multi-Persona Consoles & Redesign Suite**
  - Generated vector logo saved at `apps/web/public/logo.png`.
  - Next.js favicon configured at `apps/web/public/favicon.ico`.
  - Super Admin Tenant Onboarding Portal (`/super-admin`).
  - Client Admin Console (`/admin`).
  - Interactive Department Organogram Tree Chart (`/organogram`).
  - Employee Self-Service Mobile Portal (`/portal`).
  - Integrated official Indonesian government portal links (DJP Coretax, BPJS SIPP, BPJS e-Dabu, SIAPkerja Kemnaker).

---

## 2. Repository Collaboration Foundation

- [x] Restored `saas-foundation/` templates and engineering references inside the primary repository.
- [x] Added a single canonical contribution and page-merge workflow.
- [x] Added non-interactive ESLint and duplicate App Router validation to unblock GitHub Actions.
- [x] Verified all 13 prepared application pages are present as unique routes on `main`.
- [x] Repaired clean-install dependency ownership; GitHub Actions now passes end-to-end.
- [x] Verified the latest Git-triggered Vercel production deployment is Ready.

## 3. Pending Production Enhancement Tasks (Roadmap to Launch)

- [ ] **TASK-201: Database Seeding Script (`packages/db/src/seed.ts`)**
  - Write automated database seeder for initial tenant (`PT Nusantara Utama`), default statutory parameters (BPJS caps, TER tables), and sample employees for instant testing via `pnpm db:seed`.

- [ ] **TASK-202: Browser Blob File Downloader Integration**
  - Connect UI buttons in `/reports` and `/payroll` to trigger actual browser file downloads for DJP Coretax XML, BPJS SIPP CSV, BPJS e-Dabu CSV, and GL Accounting Journal CSV files.

- [ ] **TASK-203: Real-Time tRPC Query Client Integration (`apps/web/src/trpc/client.ts`)**
  - Replace the compatibility-only tRPC client facade with an authenticated React Query client, then connect `/onboarding`, `/attendance`, `/leave`, `/payroll`, `/severance`, and `/super-admin` to tenant-scoped PostgreSQL procedures.

- [ ] **TASK-204: Multi-Language Switcher (Bahasa Indonesia / English)**
  - Add client-side i18n locale context provider toggling all UI labels and payslip exports between Bahasa Indonesia (`id-ID`) and English (`en-US`).

- [ ] **TASK-205: Automated Staging & Production Deployment Script (`scripts/deploy.ps1`)**
  - Create deployment automation script executing database migrations (`pnpm db:push`), environment secret validation, and Vercel/Docker deployment.
