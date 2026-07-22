# NusaKerja — Indonesian HRMS + Payroll SaaS

> Multi-tenant Indonesian HRMS and statutory payroll platform built with Next.js 16, tRPC, Drizzle ORM, PostgreSQL, and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

NusaKerja is a multi-tenant SaaS application purpose-built for the Indonesian statutory and HR landscape:
- **PPh 21 Tax Engine**: Dual-mode TER (Tarif Efektif Rata-rata) monthly calculation and Article 17 annual reconciliation.
- **BPJS Social Security**: BPJS Ketenagakerjaan (JKK, JKM, JHT, JP) and BPJS Kesehatan compliance with effective-dated wage caps.
- **THR & Overtime**: Tunjangan Hari Raya calculator and PP 35/2021 statutory overtime rules.
- **GPS Location Tracking**: Real-time GPS field punch, geofencing, and offline sync queue.
- **TKA Foreign Employee Management**: KITAS, RPTKA, and DKPTKA levy management.

---

## Stack Architecture

| Layer | Selection |
|---|---|
| **Project Shape** | TypeScript Monorepo (`pnpm` workspaces + Turbo) |
| **Web Framework** | Next.js 16 App Router |
| **Backend / API** | tRPC v11 |
| **Database** | PostgreSQL (Schema-per-tenant isolation) |
| **Data Access** | Drizzle ORM |
| **Authentication** | Auth.js / NextAuth v5 + RBAC |
| **UI System** | Tailwind CSS + shadcn/ui (Bahasa-first, Merah Putih theme) |
| **State / Fetching** | React Query |
| **Background Work** | BullMQ + Redis |
| **File Storage** | S3-compatible storage |
| **Email** | Resend |
| **Observability** | Pino logger + Sentry |
| **Test Stack** | Vitest + Playwright |

---

## Quick Start

```bash
# 1. Clone & install dependencies
pnpm install

# 2. Copy environment file & setup secrets
cp .env.example .env

# 3. Start local Postgres & Redis
docker compose up -d

# 4. Push database schema
pnpm db:push

# 5. Start development server
pnpm dev
```

---

## Documentation Map

- [`AGENTS.md`](./AGENTS.md) — Non-negotiable AI agent and contributor guidelines
- [`PRODUCT.md`](./PRODUCT.md) — Product vision, user profiles, and success metrics
- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — Prioritized functional and statutory requirements
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System boundaries and monorepo structure
- [`DESIGN.md`](./DESIGN.md) — Merah Putih design tokens and UX rules
- [`SECURITY.md`](./SECURITY.md) — Data classification, authz, and security baseline
- [`DATABASE.md`](./DATABASE.md) — Schema-per-tenant model, indexing, and migrations
- [`API.md`](./API.md) — tRPC contracts and error envelopes
- [`TESTING.md`](./TESTING.md) — Test pyramid, coverage goals, and release gates
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel and Docker deployment runbooks
- [`DECISIONS.md`](./DECISIONS.md) — ADR decision log
- [`PROGRESS.md`](./PROGRESS.md) — Live execution board and stage-gate tracking
- [`CHANGELOG.md`](./CHANGELOG.md) — Version history
