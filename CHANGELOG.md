# CHANGELOG.md — NusaKerja Release History

All notable changes to the NusaKerja project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-GA] - 2026-07-23

### Added
- **Dedicated Employee & HR Login Portal** (`/login`): Multi-tenant authentication with enterprise tenant selection, persona switching, and instant trial shortcuts.
- **HR Statutory & Operations Playbook** (`/playbook`): Interactive compliance guide covering PMK 168/2023 TER tax, BPJS 2026 caps, PP 35/2021 severance rules, and Cuti Bersama 2026.
- **Sign-Out Handler** (`/sign-out`): Session revocation and multi-tenant token clearing confirmation screen.
- **Multi-Tenant Database Seeder** (`packages/db/src/seed.ts`): Pre-populated default enterprise tenants (*PT Nusantara Utama*, *CV Maju Bersama*), statutory parameters, and sample employee rosters via `pnpm db:seed`.
- **Global i18n Internationalization Context** (`I18nProvider`): Dynamic client-side locale switcher toggling between Bahasa Indonesia (`id-ID`) and English (`en-US`).
- **Automated Deployment Pipeline Script** (`scripts/deploy.ps1`): Production release script validating env secrets, typechecks, lints, DB migrations, and production builds.

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
