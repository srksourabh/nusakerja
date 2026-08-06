# REQUIREMENTS.md — NusaKerja Build Requirements

## 1. Functional Requirements

### M1: Employee Onboarding
- **ONB-1**: Self-service onboarding via one-time token link.
- **ONB-2**: Capture Indonesian identity fields: NIK/KTP (16 digits), NPWP (15/16 digits), BPJS Ketenagakerjaan & Kesehatan numbers.
- **ONB-3**: PTKP status selection (TK/0–3, K/0–3) with automatic TER Category assignment.

### M2: Core HR
- **HR-1**: Employee 360 profile, document storage, and org hierarchy.
- **HR-2**: Indonesian public holidays and *cuti bersama* leave tracking.
- **HR-3**: Every employee has `grade` ∈ {1…5} (1 lowest, 5 highest) and optional `managerEmployeeId` (immediate boss).
- **HR-4**: Manager scope is the reporting subtree under that manager; HR/Company Admin see the full company tree.

### M3: Payroll & Statutory Engine
- **PAY-1**: PPh 21 TER (Categories A, B, C) monthly tax deduction engine.
- **PAY-2**: PPh 21 Article 17 annual reconciliation and December true-up.
- **PAY-3**: BPJS Ketenagakerjaan contributions (JKK, JKM, JHT, JP with March 2026 cap of Rp11,086,300).
- **PAY-4**: BPJS Kesehatan contributions (5% split, cap Rp12,000,000).
- **PAY-5**: THR (Tunjangan Hari Raya) statutory bonus calculator.
- **PAY-6**: PP 35/2021 overtime rates (1.5x first hour, 2x subsequent hours).
- **PAY-7**: Effective-dated `pay_structure` policies (by person → grade → tenant default) supply basic + allowances into the engines above — no parallel tax logic.

### M4: Field Location Tracking
- **GPS-1**: Mobile GPS punch in/out with precision verification and geofence enforcement.
- **GPS-2**: Offline punch queue with automatic sync on reconnect.
- **GPS-3**: Multiple IN/OUT pairs per day; live timer while IN; day hours = sum of closed segments.
- **GPS-4**: OpenStreetMap punch map (self) and manager team map (subtree pins only).

### M5: TKA Foreign Employee Management
- **TKA-1**: Tracking for KITAS expiry dates, RPTKA reference numbers, and DKPTKA levy schedules.

### M6: Role Portals & Approvals
- **RP-1**: No client-side privilege elevation (Simulasi / `setRole` demo removed). Session role drives navigation.
- **RP-2**: Default UI locale English (`en-US`); Bahasa Indonesia only when the user opts in.
- **RP-3**: Company Admin / HR / Manager keep employee self-service (My Work) plus a Manage portal toggle (`shellMode`, not a role change).
- **RP-4**: Leave and expense claims route to `managerEmployeeId` (HR employee fallback); only the assigned boss may decide (HR/Company Admin may escalate).
- **RP-5**: Expense categories: `TRAVEL`, `MEAL`, `MEDICAL`, `OTHER`.
- **RP-6**: In-app notifications on leave/expense submit and decide.

### M7: SaaS Control Plane
- **SAAS-1**: Platform SuperAdmin creates companies and invites the first Company Admin (no payroll PII).
- **SAAS-2**: Optional CA (`reseller_admin`) assigned 0..1 per company; calculate-finalize only.
- **SAAS-3**: Company Admin mints HR; capability checks via `@nusakerja/auth` `can()`.

---

## 2. Demo seed (non-production)

See `docs/demo-personas.md` and `pnpm db:seed`. Tenant: **PT Nusantara Utama** (`pt-nusantara-utama`).

Org tree (grades): Admin G5 → HR G4 + Manager G3 → Budi G1 / Siti G1 / Jean G2.

---

## 3. Plan reference

Implementation units U1–U8: `docs/plans/2026-08-06-001-feat-hr-ops-role-portals-plan.md`.
SaaS RBAC: `docs/plans/2026-08-05-001-feat-saas-rbac-architecture-plan.md`.
