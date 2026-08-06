---
title: Role portals, attendance map, grade policies — Plan
type: feat
date: 2026-08-06
topic: hr-ops-role-portals
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: user-brief-2026-08-06
execution: code
origin: docs/plans/2026-08-06-001-feat-hr-ops-role-portals-plan.md
---

# Role Portals, Attendance Map & Grade Policies — Implementation Plan

> **For agentic workers:** Prefer `ce-work` / subagent-driven development task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove demo role switching, lock each user to a role-correct dual shell (self-service + management portal), default UI to English, and ship attendance (multi-punch timer + OSM map), grade 1–5 policy assignment, leave/expense approval by immediate boss — all on top of existing Indonesian statutory payroll.

**Architecture:** Keep company-as-tenant + capability RBAC. Every company user has an **employee record** (self-service: punch, leave, expenses, payslip) plus an optional **role portal** (Company Admin / HR / Manager). Org tree uses `managerEmployeeId` + `grade` (1–5). Policies (leave, HR, pay structure) are effective-dated and assigned by grade and/or person. Attendance stays event-sourced punches; daily hours = sum of closed IN→OUT intervals. Maps use Leaflet + OpenStreetMap (no paid map SDK).

**Tech Stack:** Next.js App Router, tRPC, Drizzle/Postgres, `@nusakerja/auth` capabilities, Leaflet + `react-leaflet` (OSM tiles), existing PPh 21 TER / BPJS engines in `@nusakerja/config`.

## Global Constraints

- Indonesia-only statutory payroll; rates/caps stay in effective-dated `statutory_parameters` — never hardcoded.
- No client-side role elevation (`setRole` demo / **Simulasi** must go).
- Default locale **en-US**; Bahasa Indonesia only when the user explicitly selects it (persisted preference).
- Preserve existing leave calculation and punch UX behavior customers like; extend, do not gut.
- Manager scope = subtree of employees reporting (directly or indirectly) to that manager.
- Immediate boss = employee’s `managerEmployeeId` user; leave + expense approvals route there first.
- Open-source map only (OpenStreetMap via Leaflet); no Google Maps dependency for v1.
- Grade scale fixed: **1 (lowest) … 5 (highest)**.

---

## Product Contract

### Problem Frame

Production still exposes a **Simulasi** toggle that lets any company user flip between employee and HR UI via `localStorage`. Language defaults to Indonesian. Role shells are mixed (employee sees HR-console density). Attendance supports GPS punches but not a clear running timer, multi-segment day totals, or a live team map. There is no grade band, no expense claims, and leave approval is not clearly wired to the immediate boss. Payroll statutory engines exist and must remain the calculation backbone when pay structures are assigned by grade.

### Actors & dual shell

| Actor | Self-service (always) | Management portal |
|---|---|---|
| Employee | Punch, leave, expenses, payslip, own map history | — |
| Manager | Same as employee | Team tree, team map, approve leave/expenses for reports |
| HR | Same as employee | Org, grades, policies, payroll run (with Company Admin), full company attendance |
| Company Admin | Same as employee | Full company ops + appoint HR + disbursement/filing (existing RBAC) |
| CA / SuperAdmin | Unchanged from SaaS RBAC plan | Control plane / calculate-only |

**Decision:** Admin/HR/Manager are also employees. UI pattern = two modes in one session: **My Work** | **Manage** — never a fake role switch that becomes another persona.

### Requirements

**UX / i18n / auth surface**

- R1. Remove **Simulasi** and any client `setRole` path that elevates privileges; nav and portals derive only from server session role.
- R2. Default language is English (`en-US`). Indonesian (`id-ID`) appears only after explicit user choice; preference persists.
- R3. Role-labelled shells: Company Admin view, HR view, Manager view, Employee view (simple).
- R4. Company Admin / HR / Manager always retain employee self-service (punch in/out, payslip, leave, expenses) alongside their portal.

**Org & grade**

- R5. Every employee has `grade` ∈ {1,2,3,4,5} and optional `managerEmployeeId` (immediate boss).
- R6. Manager portal shows the reporting tree of people under them and their last/known punch locations on a map.
- R7. HR may create leave policies, HR policies, payroll/pay-structure policies and assign them by grade and/or individual.

**Attendance**

- R8. Multiple punch-in / punch-out pairs per day are allowed.
- R9. While punched in, a second/minute/hour counter runs client-side from last IN; stops on OUT.
- R10. Working hours for a day = sum of durations of all closed IN→OUT segments that day (open IN counts as elapsed until now for live display only; payroll day close uses closed segments + configurable midnight rule already present).
- R11. Every punch with lat/lng is shown on an OpenStreetMap-based map; employee sees own pins; manager sees team pins.

**Approvals**

- R12. Leave request routes to immediate boss; boss is notified and can approve/reject.
- R13. Expense reimbursement request routes to the same immediate boss; approve/reject + notification.
- R14. If no manager assigned, escalate to HR (fallback), then Company Admin.

**Payroll**

- R15. Pay structures / components assigned via grade or person feed the existing Indonesian statutory engines (PPh 21 TER, BPJS, THR, overtime PP 35/2021) — no parallel tax logic.

### Non-goals (this program)

- Replacing statutory parameter tables with hardcoded rates.
- Google Maps / paid map tiles as default.
- Schema-per-tenant migration.
- Full mobile native apps (web + geolocation is enough).
- Multi-country packs.

### Success criteria

- Employee cannot reach HR nav or elevate via UI.
- English is first paint; ID only after toggle.
- Admin/HR/Manager can punch and see payslip without leaving their account.
- Day with three IN/OUT pairs shows summed hours equal to sum of intervals (±1s).
- Manager map shows only subtree employees with recent coordinates.
- Leave and expense pending items appear in boss inbox; reject/approve audited.

---

## Key Decisions

| ID | Decision | Rationale |
|---|---|---|
| D1 | Dual shell **My Work / Manage**, not role impersonation | Fixes Simulasi security hole; matches “admin is also employee” |
| D2 | Leaflet + OSM tiles | User asked open-source map; no API key gate |
| D3 | Grade 1–5 on `employees` + policy assignment tables | Single ladder for leave/HR/pay |
| D4 | Immediate boss = `managerEmployeeId` | Clear approval chain |
| D5 | Daily hours = sum closed segments | Matches multi punch-in/out |
| D6 | Default `en-US` in i18n provider | User request |
| D7 | Phased delivery (see units) | Avoid big-bang; each unit shippable |

### Open (resolve at implementation kickoff if needed)

- O1. Exact expense categories (travel, meal, medical, other) — default proposed set below.
- O2. Whether grade-5 auto-approves own leave (recommend **no** — still needs peer Company Admin / HR).
- O3. Geofence hard-block vs soft-warn on map punch (keep current soft/hard flag on punch row).

---

## Current code anchors

| Area | Path |
|---|---|
| Simulasi + fat sidebar | `apps/web/app/(dashboard)/layout.tsx` |
| Client role switch | `apps/web/src/context/auth-context.tsx` (`setRole`) |
| i18n default | `apps/web/src/context/i18n-context.tsx` (today often id-first in UI) |
| Punches schema | `packages/db/src/schema/attendance_punches.ts` |
| Attendance router | `apps/web/trpc/routers/attendance.ts` |
| Leave schema | `packages/db/src/schema/leave_requests.ts` |
| Employees (no grade/manager yet) | `packages/db/src/schema/employees.ts` |
| Capabilities | `packages/auth/src/capabilities.ts` |
| Statutory payroll | `packages/config` + `apps/web/trpc/routers/payroll.ts` |
| Prior RBAC plan | `docs/plans/2026-08-05-001-feat-saas-rbac-architecture-plan.md` |

---

## Data model (additive)

```text
employees
  + grade smallint NOT NULL DEFAULT 1  CHECK (1..5)
  + manager_employee_id uuid NULL REFERENCES employees(id)
  + department_id / designation_id (optional follow-on if not present)

hr_policies (tenant_id, name, kind: leave|hr_general|pay_structure, payload jsonb, effective_from, effective_to)
policy_assignments (tenant_id, policy_id, grade nullable, employee_id nullable)  -- exactly one of grade|employee

expense_claims (tenant_id, employee_id, amount_idr, category, description, receipt_url, status, approved_by, …)
notifications (tenant_id, user_id, type, resource, resource_id, read_at, created_at)

attendance_day_summaries (optional materialized): tenant_id, employee_id, work_date, total_seconds
  -- can also be computed on read from punches; prefer compute-on-read first, materialize if slow
```

Punch pairing algorithm (directional):

```
sort punches for employee+local_date by punchTime
walk: unpaired IN starts segment; OUT closes it → add (out-in) seconds
orphan OUT ignored/warned; trailing IN → live elapsed only
```

---

## Implementation Units (sequenced)

### U1 — Kill Simulasi + English default + role shells

**Files:** `apps/web/app/(dashboard)/layout.tsx`, `apps/web/src/context/auth-context.tsx`, `apps/web/src/context/i18n-context.tsx`, portal/dashboard pages as needed.

**Behavior:**
- Delete Simulasi button and stop exporting privilege `setRole` for production UI (keep internal test helper only if gated by `ENABLE_DEMO_LOGIN`).
- Session role drives nav; employee nav = My Work only (Portal, Punch, Leave, Expenses, Payslip, Sign out).
- Company Admin / HR / Manager get **My Work | Manage** switch (mode, not role).
- i18n default `en-US`; label language control “Bahasa Indonesia” / “English”.

**Tests:**
- AE: employee localStorage cannot unlock HR links after reload if session role is employee.
- i18n first paint is English without prior preference.

### U2 — Org tree: manager + grade

**Files:** `packages/db/src/schema/employees.ts`, migration/seed, `apps/web/trpc/routers/employees.ts`, organogram / team pages.

**Behavior:**
- Add `grade`, `managerEmployeeId`.
- HR/Company Admin assign manager & grade.
- Manager `listTeamSubtree` recursive CTE or bounded depth query.
- Seed grades on demo company.

**Tests:** Manager cannot list employee outside subtree; grade rejects 0/6.

### U3 — Multi-punch day hours + live timer

**Files:** `apps/web/trpc/routers/attendance.ts`, attendance/portal UI, pure helper `packages/config` or `apps/web/src/utils/punch-hours.ts`.

**Behavior:**
- Allow many IN/OUT per day (already event rows — enforce pairing rules).
- API: `todayStatus` → `{ state: 'IN'|'OUT', since, segments[], totalSecondsClosed, liveElapsedSeconds }`.
- UI timer ticks while IN.
- Day total = sum closed segments.

**Tests:** Three pairs → hours equal sum; double IN rejected or auto-closes prior (pick one — recommend reject second IN until OUT).

### U4 — OpenStreetMap punch map + manager team map

**Files:** new `apps/web` map component (Leaflet), attendance + manager pages, attendance list with lat/lng.

**Behavior:**
- Employee map: own punches for selected day/range.
- Manager map: latest punch (or today’s) for each report in subtree + org tree side panel.
- No Google key; OSM tile attribution required.

**Tests:** Punch without coordinates omitted from map layer; manager does not see other teams’ pins.

### U5 — Policy engine by grade

**Files:** new schema `hr_policies`, `policy_assignments`; tRPC `policies` router; HR UI.

**Behavior:**
- HR creates policies (`leave`, `hr_general`, `pay_structure`).
- Assign to grade and/or employee (employee override wins).
- Leave entitlement / pay components resolve: person override → grade → tenant default.

**Tests:** Grade-3 leave days differ from grade-1; person override beats grade.

### U6 — Leave + expense → immediate boss + notifications

**Files:** extend `leave_requests` (approver routing), new `expense_claims`, `notifications`; leave UI; new expenses UI; inbox for managers.

**Behavior:**
- On submit, set `approverEmployeeId = managerEmployeeId` (fallback HR).
- Insert notification for approver’s user.
- Approve/reject with audit.
- Expense categories: `TRAVEL`, `MEAL`, `MEDICAL`, `OTHER` (O1).

**Tests:** Submit leave creates PENDING for boss; non-boss approve fails; employee sees status.

### U7 — Pay structure → statutory payroll

**Files:** payroll router/UI; policy payload shape for components; wire into existing TER/BPJS calculators.

**Behavior:**
- Resolved pay structure supplies base + allowances; statutory engines unchanged.
- Company Admin/HR run payroll as today; CA calculate-only still applies.

**Tests:** Fixture employee grade-2 structure → PPh/BPJS match golden fixture within 1 IDR.

### U8 — Docs & seed

**Files:** `REQUIREMENTS.md`, `PROGRESS.md`, `CHANGELOG.md`, `SECURITY.md`, seed personas with managers/grades.

---

## Suggested execution order

```text
U1 (UX lock) → U2 (org/grade) → U3 (hours) → U4 (map)
                ↘ U5 (policies) → U6 (approvals) → U7 (payroll bind) → U8 (docs)
```

U1 is a security/UX hotfix and should ship first (even alone). U3/U4 can parallelize after U2. U5 before U6/U7.

---

## Verification matrix (program-level)

| # | Scenario | Expect |
|---|---|---|
| V1 | Employee clicks nothing resembling Simulasi | No HR nav |
| V2 | Fresh browser, no locale cookie | English UI |
| V3 | Company Admin → My Work → Punch IN | Timer runs; Manage still available |
| V4 | Manager tree | Only reports |
| V5 | 2× (IN, OUT) same day | Hours = sum |
| V6 | Manager map | Pins for team only |
| V7 | Grade policy | Different leave days by grade |
| V8 | Leave/expense | Boss inbox notify + approve |
| V9 | Payroll | Statutory outputs for assigned structure |

---

## Risks

| Risk | Mitigation |
|---|---|
| Client auth still trusted for nav | Server capabilities on every mutation; U1 removes elevation |
| Leaflet SSR issues in Next | Dynamic import `ssr: false` for map |
| Deep org CTE performance | Cap depth; index `manager_employee_id` |
| Policy JSON sprawl | Versioned payload schema with Zod |
| Midnight open punch | Keep existing auto punch-out rule; document in U3 |

---

## Definition of Done (program)

- [ ] Simulasi gone; no client privilege elevation
- [ ] English default; ID opt-in
- [ ] Dual shell for Admin/HR/Manager
- [ ] Grade 1–5 + manager tree
- [ ] Multi-punch hours + live timer
- [ ] OSM maps (self + manager team)
- [ ] Policies assignable by grade/person
- [ ] Leave + expenses to immediate boss with notifications
- [ ] Payroll still Indonesia-statutory via existing engines
- [ ] `pnpm typecheck`, lint, and unit tests for punch-hours + policy resolve green

---

## Traceability

| User ask | Units |
|---|---|
| Remove Simulasi | U1 |
| Default English / ID on request | U1 |
| Role views + admin/HR also employees | U1 |
| Manager controls team | U2, U4, U6 |
| Punch timer + multi IN/OUT + sum hours | U3 |
| Open-source map + manager locations | U4 |
| Gradation 1–5 → policies | U2, U5 |
| HR creates/assigns policies | U5, U7 |
| Leave + expenses → boss | U6 |
| Indonesian statutory payroll | U7 + existing engines |
