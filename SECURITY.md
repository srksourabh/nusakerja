# SECURITY.md — NusaKerja Security & Privacy Baseline

## 1. Security Controls Matrix

| Threat Category | Mitigation | Location |
|---|---|---|
| **XSS & Injection** | Content Security Policy (CSP), React auto-escaping, Drizzle parameterized queries | `apps/web` middleware / headers, `@nusakerja/db` |
| **Clickjacking** | `X-Frame-Options: DENY`, `frame-ancestors 'none'` | Next headers / middleware |
| **Brute Force** | IP & User-based rate limiting via Redis | middleware (where enabled) |
| **Unauthorized Access** | Capability RBAC (`can()`), session cookies, tenant filters | `@nusakerja/auth`, tRPC context |
| **Client privilege escalation** | No Simulasi / no production `setRole`; nav locked to session role; Manage is `shellMode` only | `auth-context`, dashboard layout |
| **Manager overreach** | Team APIs scoped to reporting subtree (`collectSubtreeIds`) | employees / attendance / leave routers |
| **Approval spoofing** | Leave/expense decide requires designated `approverEmployeeId` (or HR/Admin escalate) | `approval-routing`, leave/expenses routers |
| **Data Privacy (UU PDP)** | GPS consent / geolocation Permissions-Policy; tenant-scoped PII | attendance punch, headers |
| **Statutory integrity** | Rates/caps in effective-dated parameters — not hardcoded in feature logic | `statutory_parameters`, payroll engines |

---

## 2. Role-Based Access Control (RBAC)

Canonical product names with legacy DB enum aliases (see `docs/plans/2026-08-05-001-feat-saas-rbac-architecture-plan.md`):

| Product role | DB `user_role` | Authority summary |
|---|---|---|
| Platform SuperAdmin | `super_admin` | Control plane only: create/suspend tenants, invite first Company Admin, assign/clear CA, hierarchy (no payroll PII) |
| CA (Chartered Accountant) | `reseller_admin` | One user per firm; 0..1 assignment per company; payroll calculate finalize only |
| Company Admin | `client_admin` | Full company ops; mints HR; disbursement + filing sign-off |
| HR Admin | `hr_admin` | Full company ops except minting HR; org / policies |
| Manager | `manager` | Subtree attendance/maps; leave & expense approve for reports |
| Employee | `employee` | Self-service punch, leave, expenses, payslip |

`payroll_admin` remains in the enum for compatibility but is not granted new seats.

Authorization uses capability checks in `@nusakerja/auth` (`can()`), not numeric role rank alone. Tenant isolation for this release uses shared-table `tenant_id` filters (physical schema-per-tenant ADR deferred).

**UI shell vs authority:** Admin/HR/Manager may toggle My Work / Manage. That toggle never changes `user.role` or capabilities — only navigation density.

---

## 3. Audit Logging

All sensitive administrative actions (login attempts, role changes, payroll calculate/disburse/filing, leave/expense decide, policy create/assign) emit structured events stored in the `audit_logs` table.

---

## 4. Demo credentials

Demo passwords in seed are **non-production only**. Rotate or disable before any shared environment beyond the team demo. See `docs/demo-personas.md`.
