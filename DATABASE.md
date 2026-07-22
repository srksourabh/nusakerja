# DATABASE.md — NusaKerja Data Blueprint & Migrations

## 1. Database System

- **Datastore**: PostgreSQL 16.
- **ORM**: Drizzle ORM (`packages/db`).
- **Migration Strategy**: Drizzle Kit version-controlled SQL migrations.

---

## 2. Core Entities

1. `tenants`: Multi-tenant companies with isolated schema names (`schema_name`).
2. `users`: System users with tenant references and assigned roles (`user_role`).
3. `sessions`: Active authentication sessions.
4. `audit_logs`: Audit trail for compliance and security events.
5. `employees`: Indonesian employee 360 data including NIK, NPWP, BPJS numbers, PTKP status, worker category, and salary.
6. `payroll_runs`: Monthly payroll runs tracking total gross, PPh 21 tax, BPJS contributions, and net payouts.

---

## 3. Statutory Parameter Storage

Statutory parameters (BPJS caps, TER tables, PTKP thresholds) are effective-dated records stored in database tables, enabling rate updates without software deployments.
