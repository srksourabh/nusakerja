# ARCHITECTURE.md — NusaKerja System Architecture

## 1. Monorepo Structure

```
nusakerja/
├── apps/
│   └── web/                   # Next.js 16 App Router (UI & API handlers)
├── packages/
│   ├── db/                    # Drizzle ORM PostgreSQL schema & client
│   ├── auth/                  # Auth.js v5 multi-tenant RBAC
│   ├── validators/            # Shared Zod validation schemas
│   ├── config/                # Environment variables & Pino logger
│   └── ui/                    # Tailwind CSS v4 + shadcn/ui components
├── tooling/                   # Shared TypeScript & ESLint configs
├── scripts/                   # PowerShell scaffolding CLI
└── docker/                    # PostgreSQL & Redis Compose setup
```

---

## 2. Multi-Tenancy Design

NusaKerja implements **Schema-per-Tenant** PostgreSQL isolation:
- Shared system catalog in the `public` schema for tenant metadata, users, and audit logs.
- Dedicated PostgreSQL schema per tenant company (`tenant_<slug>`) holding tenant-specific employee, attendance, and payroll records.

---

## 3. Data Flow & Technology Boundaries

1. **Frontend**: Next.js App Router client components styled with Tailwind CSS & shadcn/ui.
2. **API Layer**: End-to-end type-safe tRPC v11 procedures with Zod validation.
3. **Database Layer**: Drizzle ORM connecting to PostgreSQL 16.
4. **Asynchronous Jobs**: BullMQ workers connected to Redis 7 for heavy payroll calculations, report generation, and email dispatch.
