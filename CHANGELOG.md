# CHANGELOG.md — NusaKerja Release History

All notable changes to the NusaKerja project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Restored the payroll calculator's strict TypeScript compatibility with the statutory engine. Its BPJS deductions, employer cost, PPh 21 TER amount, PTKP category, and NPWP surcharge now use the engine's current result contract.
- Restored Vercel production deployment by separating the public `/` landing page from the authenticated `/dashboard` route and configuring the Vercel project root as `apps/web`.
- Restored non-interactive ESLint configuration and added automated App Router collision checks so page changes can pass CI and merge safely.

### Added
- Restored the `saas-foundation/` reference folder and added a canonical contribution and merge workflow.

## [1.0.0] - 2026-07-23

### Added
- Official **PMK 168/2023 TER Tax Engine** (Categories A, B, C with 44/17/15 Bands, Non-NPWP 1.2x surcharge, BIK Natura/Kenikmatan PMK 66/2023, Zakat deductions, and PPh 26 DTAA treaties).
- **BPJS Statutory Engine** with effective March 2026 pension cap (Rp11.086.300/mo) and JKK risk tiers (0.24%–1.74%).
- Hostinger Docker PostgreSQL Database instance (`nusakerja-postgres` at `187.124.96.63:5432`) with 11 tables and 7 custom ENUM types.
- **Super Admin Tenant Onboarding Console** (`/super-admin`) with automated database schema provisioning.
- **Client Admin Console** (`/admin`), **Interactive Organogram** (`/organogram`), **Employee Mobile Portal** (`/portal`), and **Statutory Report Exporter** (`/reports`).
- Connected GitHub Repository (`srksourabh/nusakerja`) with automated Vercel Production deployment pipeline.

## [0.1.0] - 2026-07-22

### Added
- Initialized production-grade monorepo foundation (`@nusakerja/web`, `@nusakerja/db`, `@nusakerja/auth`, `@nusakerja/validators`, `@nusakerja/config`, `@nusakerja/ui`).
- Multi-tenant PostgreSQL schema configuration with Drizzle ORM.
- Auth.js v5 multi-tenant RBAC configuration with 7 user roles.
- Indonesian statutory validators for NIK/KTP, NPWP, BPJS TK, and BPJS Kesehatan formats.
- Merah Putih Indonesian design system theme tokens and UI component library.
