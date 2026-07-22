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

1. `super_admin`: Full system infrastructure & tenant management.
2. `reseller_admin`: Multi-tenant accounting firm managing client payrolls.
3. `client_admin`: Client company executive.
4. `hr_admin`: Employee onboarding, leave, and HR inbox.
5. `payroll_admin`: Monthly PPh 21, BPJS, and disbursement execution.
6. `manager`: Attendance and leave approvals.
7. `employee`: Mobile attendance punch, leave requests, payslip view.

---

## 3. Audit Logging

All sensitive administrative actions (login attempts, role changes, salary modifications, statutory exports) emit structured JSON events stored in the `audit_logs` table.
