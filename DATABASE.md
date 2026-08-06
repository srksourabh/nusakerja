# DATABASE.md — NusaKerja Data Blueprint & Migrations

## 1. Database System

- **Datastore**: PostgreSQL 16.
- **ORM**: Drizzle ORM (`packages/db`).
- **Migration Strategy**: Drizzle Kit version-controlled SQL migrations under `packages/db/drizzle/`.

### Migration index (HR ops program)

| File | Unit | Contents |
|---|---|---|
| `0000_*.sql` | Foundation | Core SaaS / HR tables |
| `0001_employee_grade_manager.sql` | U2 | `employees.grade`, `manager_employee_id` |
| `0002_hr_policies.sql` | U5 | `hr_policies`, `policy_assignments` |
| `0003_leave_expense_notifications.sql` | U6 | leave approver column, `expense_claims`, `notifications` |

Run: `pnpm db:push` (or apply SQL in order) then `pnpm db:seed`.

---

## 2. Core Entities

1. `tenants`: Multi-tenant companies with isolated schema names (`schema_name`).
2. `users`: System users with tenant references and assigned roles (`user_role`).
3. `sessions`: Active authentication sessions.
4. `audit_logs`: Audit trail for compliance and security events.
5. `employees`: Indonesian employee 360 data including NIK, NPWP, BPJS numbers, PTKP status, worker category, salary, **grade (1–5)**, and **manager_employee_id** (immediate boss).
6. `leave_requests`: Statutory leave types/status; **approver_employee_id** for boss routing (U6).
7. `attendance_punches`: Event-sourced IN/OUT with optional lat/lng.
8. `hr_policies` / `policy_assignments`: Effective-dated leave / HR / pay_structure policies by grade, person, or tenant default (U5).
9. `expense_claims`: Reimbursement (`TRAVEL`/`MEAL`/`MEDICAL`/`OTHER`) with approver routing (U6).
10. `notifications`: In-app leave/expense alerts (U6).
11. `payroll_runs` / `payroll_items`: Monthly runs; items may record resolved pay_structure drilldown (U7).
12. `statutory_parameters`: Effective-dated rates/caps (never hardcode in feature code).
13. `ca_firms` / `company_ca_assignments` / `invites`: CA portfolio and SuperAdmin invites.

---

## 3. Statutory Parameter Storage

Statutory parameters (BPJS caps, TER tables, PTKP thresholds) are effective-dated records stored in database tables, enabling rate updates without software deployments.

---

## 4. Demo seed

See `docs/demo-personas.md`. Command: `pnpm db:seed`.
