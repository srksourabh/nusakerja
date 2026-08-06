# PROGRESS.md — NusaKerja Master Task & Production Readiness Tracker

> Status: **Production** `main` includes SaaS RBAC + Easy Login + company URLs + HR ops **U1–U8**.

Plan: `docs/plans/2026-08-06-001-feat-hr-ops-role-portals-plan.md`  
Personas: `docs/demo-personas.md`

- [x] U1 Kill Simulasi + English default + dual My Work / Manage shells
- [x] U2 Org tree manager + grade 1–5
- [x] U3 Multi-punch day hours + live timer
- [x] U4 OSM punch / team map
- [x] U5 Policy engine by grade
- [x] U6 Leave + expense → immediate boss
- [x] U7 Pay structure → statutory payroll
- [x] U8 Docs & seed
## HR ops role portals (U1–U8)

| Unit | Status | Notes |
|---|---|---|
| U1 Kill Simulasi + English default + dual My Work / Manage | Done on `main` | |
| U2 Org tree manager + grade 1–5 | Done on `main` | Migration `0001_…` |
| U3 Multi-punch day hours + live timer | Done on `main` | |
| U4 OSM punch / team map | Done on `main` | |
| U5 Policy engine by grade | Done on `main` | Migration `0002_…` |
| U6 Leave + expense → immediate boss | Done on `main` | Migration `0003_…` |
| U7 Pay structure → statutory payroll | Done on `main` | |
| U8 Docs & seed | Done on `main` | `docs/demo-personas.md` |

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
