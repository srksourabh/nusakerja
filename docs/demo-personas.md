# Demo personas — NusaKerja seed

> Non-production only. Created by `pnpm db:seed` against tenant **PT Nusantara Utama** (`slug: pt-nusantara-utama`).

## Login accounts

| Role | Email | Password | Notes |
|---|---|---|---|
| Platform SuperAdmin | `srksourabh@gmail.com` | `DemoSuperAdmin!2026` | Control plane; no company payroll PII |
| CA | `ca@nusakerja.id` | `DemoCA!2026` | Portfolio; calculate-finalize only |
| Company Admin | `admin@nusantara.co.id` | `DemoAdmin!2026` | Linked employee `NK-ADM` grade 5 |
| HR Admin | `bambang.hr@nusantara.co.id` | `DemoHR!2026` | Linked employee `NK-HR` grade 4 |
| Manager | `manager@nusantara.co.id` | `DemoManager!2026` | Linked employee `NK-MGR` grade 3 |
| Employee | `budi.santoso@nusantara.co.id` | `DemoEmployee!2026` | Linked employee `NK-001` grade 1 |

Company URL (after DNS / middleware): `https://pt-nusantara-utama.nusakerja.com` (path fallback `/c/pt-nusantara-utama`).

## Org tree (grades + managers)

```text
Administrator HR Master (NK-ADM, G5)
├── Bambang Prasetyo (NK-HR, G4)
└── Rina Manager (NK-MGR, G3)
    ├── Budi Santoso (NK-001, G1)
    ├── Siti Nurhaliza (NK-002, G1)
    └── Jean-Pierre Dupont (NK-003, G2)  [TKA]
```

Immediate boss for leave/expense: each report’s `manager_employee_id` (Budi/Siti/Jean → Rina; Rina/Bambang → Admin).

## Related seed data (when U5–U7 migrations applied)

- Leave policies: tenant default 12 days; grade 3 = 18 days; Budi person override 24 days.
- Pay structures: tenant default; grade 2 = BASIC 8M + TRANSPORT 500k + MEAL 300k.
- Apply migrations via `pnpm db:push` (or SQL under `packages/db/drizzle/`), then re-seed.

## Program plan

`docs/plans/2026-08-06-001-feat-hr-ops-role-portals-plan.md` (units U1–U8).
