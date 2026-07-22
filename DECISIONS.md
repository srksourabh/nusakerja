# DECISIONS.md — Architecture Decision Log (ADRs)

## Decision Index

| ADR ID | Title | Status | Date |
|---|---|---|---|
| **ADR-001** | Base Architecture Choice (Monorepo, tRPC, Drizzle, Schema-per-Tenant) | Approved | 2026-07-22 |
| **ADR-002** | Indonesian PPh 21 TER Dual-Mode Tax Calculation Engine | Approved | 2026-07-22 |
| **ADR-003** | BPJS Contribution Engine with Effective-Dated Statutory Caps | Approved | 2026-07-22 |
| **ADR-004** | Merah Putih Design System & Bahasa Indonesia First Localization | Approved | 2026-07-22 |
| **ADR-005** | Native GPS Location Tracking with Offline Sync Queue | Approved | 2026-07-22 |

---

### ADR-001: Base Architecture Choice

- **Context**: NusaKerja requires multi-tenant isolation for accounting firms and statutory flexibility.
- **Decision**: Adopt a `pnpm` monorepo structure with Next.js 16 App Router, tRPC v11, Drizzle ORM, and PostgreSQL schema-per-tenant isolation.
- **Consequences**: Ensures strict tenant privacy while maintaining a single unified codebase.
