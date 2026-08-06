# PROGRESS.md — NusaKerja Master Task & Production Readiness Tracker

> Status: **Production** on `main` includes SaaS RBAC + Easy Login + company URLs. HR ops role portals program in progress on `cursor/hr-ops-role-portal-plan-a88a` (`docs/plans/2026-08-06-001-feat-hr-ops-role-portals-plan.md`).

## Planned next — HR ops role portals

- [x] U1 Kill Simulasi + English default + dual My Work / Manage shells
- [x] U2 Org tree manager + grade 1–5
- [x] U3 Multi-punch day hours + live timer
- [x] U4 OSM punch / team map
- [x] U5 Policy engine by grade
- [ ] U6 Leave + expense → immediate boss
- [ ] U7 Pay structure → statutory payroll
- [ ] U8 Docs & seed

## Latest — SaaS RBAC (merged to main)

- [x] Capability foundation + Vitest (`packages/auth`)
- [x] CA assignment / invite schema
- [x] Session-backed tRPC context + login API
- [x] Platform / CA / payroll / leave / attendance authz gates
- [x] Demo seed users + login autofill personas
- [x] Login hierarchy guide + one-click SuperAdmin / CA / Company Admin entry
- [x] SuperAdmin create company + invite Company Admin + assign CA (wired UI)
- [x] CA portfolio live query + Company Admin Tim & Peran (angkat HR)
- [x] Easy Login (temp) on landing + company URL `https://{slug}.nusakerja.com` (path fallback `/c/{slug}`)
- [ ] DB push of new tables to production (run `pnpm db:push` / migrate in deploy)
- [ ] Full AE1–AE8 integration tests against live DB

---

## Latest Verified Release — 2026-07-23 (v1.0.0-GA)

- Production: `https://nusakerja.vercel.app` — HTTP 200 verified.
- Production dashboard: `/dashboard` — HTTP 200 verified.
- Health endpoint: `/api/health` — application, PostgreSQL, and Redis report connected.
- GitHub `main`: synchronized.
- GitHub Actions: lint, typecheck, route tests, and production build all pass (0 errors).
- Database: Drizzle migrations & `pnpm db:seed` applied successfully.
- App Router: 16 unique application pages validated on `main`.

---

## 1. Completed Core Engineering Phases (`Phases 0–6`)

- [x] **Phase 0: Project Scaffold & Monorepo Foundation**
- [x] **Phase 1: Core Infrastructure Packages**
- [x] **Phase 2: Security & Privacy Hardening**
- [x] **Phase 3: Operational Excellence**
- [x] **Phase 4: Scaffolding Tools**
- [x] **Phase 5: Knowledge Context Docs & Agent Configs**
- [x] **Phase 6: Multi-Persona Consoles & Redesign Suite**

---

## 2. Completed Production Enhancement Tasks (v1.0.0-GA)

- [x] **TASK-201: Database Seeding Script (`packages/db/src/seed.ts`)**
  - Automated database seeder for enterprise tenants (`PT Nusantara Utama`, `CV Maju Bersama`), statutory parameters (BPJS March 2026 caps, PMK 168/2023 TER tables), and sample employee roster via `pnpm db:seed`.

- [x] **TASK-202: Browser Blob File Downloader Integration**
  - Integrated 1-Click exporters in `/reports` and `/payroll` for actual browser file downloads of DJP Coretax XML (e-Bupot 21/26), BPJS SIPP CSV, and General Ledger (GL) Accounting Journals.

- [x] **TASK-203: Real-Time tRPC Query Client Integration (`apps/web/trpc`)**
  - Configured tRPC router procedures for `/onboarding`, `/attendance`, `/leave`, `/payroll`, `/severance`, `/reports`, and `/super-admin`.

- [x] **TASK-204: Multi-Language Switcher (Bahasa Indonesia / English)**
  - Dual-language React context provider (`I18nProvider`) toggling UI labels and navigation between Bahasa Indonesia (`id-ID`) and English (`en-US`).

- [x] **TASK-205: Automated Staging & Production Deployment Script (`scripts/deploy.ps1`)**
  - Deployment automation pipeline script executing secret validation, typechecking (`pnpm typecheck`), linting (`pnpm lint`), DB migrations (`pnpm db:push`), and production build.

