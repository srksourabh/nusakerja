# CHANGELOG.md — NusaKerja Release History

All notable changes to the NusaKerja project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initialized production-grade monorepo foundation (`@nusakerja/web`, `@nusakerja/db`, `@nusakerja/auth`, `@nusakerja/validators`, `@nusakerja/config`, `@nusakerja/ui`).
- Multi-tenant PostgreSQL schema configuration with Drizzle ORM.
- Auth.js v5 multi-tenant RBAC configuration with 7 user roles.
- Indonesian statutory validators for NIK/KTP, NPWP, BPJS TK, and BPJS Kesehatan formats.
- CSP, Helmet security headers, and health check API probe (`/api/health`).
- Merah Putih Indonesian design system theme tokens and initial UI components (`Button`, `Card`, `Badge`).
- All 14 mandatory context documentation files and AI agent configuration blueprints (`agent.md`, `CLAUDE.md`).
