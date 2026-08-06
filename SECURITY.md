# SECURITY.md — NusaKerja Security & Privacy Baseline

## 1. Security Controls Matrix

| Threat Category | Mitigation | Location |
|---|---|---|
| **XSS & Injection** | Content Security Policy (CSP), React auto-escaping, Drizzle parameterized queries | `apps/web/src/middleware.ts`, `@nusakerja/db` |
| **Clickjacking** | `X-Frame-Options: DENY`, `frame-ancestors 'none'` | `apps/web/src/middleware.ts` |
| **Brute Force** | IP & User-based rate limiting via Redis | `apps/web/src/middleware.ts` |
| **Unauthorized Access** | Multi-tenant RBAC enforcement & Session rotation | `@nusakerja/auth` |
| **Data Privacy (UU PDP)** | Explicit GPS location consent layer & encrypted PII | `M4 Location Tracking`, `@nusakerja/db` |

---

## 2. Role-Based Access Control (RBAC)

Canonical product names with legacy DB enum aliases (see `docs/plans/2026-08-05-001-feat-saas-rbac-architecture-plan.md`):

| Product role | DB `user_role` | Authority summary |
|---|---|---|
| Platform SuperAdmin | `super_admin` | Control plane only: create/suspend tenants, invite first Company Admin, assign/clear CA, hierarchy (no payroll PII) |
| CA (Chartered Accountant) | `reseller_admin` | One user per firm; 0..1 assignment per company; payroll calculate finalize only |
| Company Admin | `client_admin` | Full company ops; mints HR; disbursement + filing sign-off |
| HR Admin | `hr_admin` | Full company ops except minting HR; org structure |
| Manager | `manager` | Attendance & leave approvals |
| Employee | `employee` | Self-service punch, leave, payslip |

`payroll_admin` remains in the enum for compatibility but is not granted new seats.

Authorization uses capability checks in `@nusakerja/auth` (`can()`), not numeric role rank alone. Tenant isolation for this release uses shared-table `tenant_id` filters (physical schema-per-tenant ADR deferred).

---

## 3. Audit Logging

All sensitive administrative actions (login attempts, role changes, salary modifications, statutory exports) emit structured JSON events stored in the `audit_logs` table.
