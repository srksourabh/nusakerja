# Agent Instructions — Anti-Gravity AI Coding Assistant

> Project: NusaKerja (Indonesian HRMS + Payroll SaaS)

## Monorepo Layout & Tooling

- Package manager: `pnpm`
- Monorepo tool: Turbo
- Framework: Next.js 16 (App Router)
- API: tRPC v11
- ORM: Drizzle ORM (PostgreSQL)
- Styling: Tailwind CSS v4 + `@nusakerja/ui`

---

## Operating Rules for Anti-Gravity Agent

1. **Strict Types**: Never use `any`. Define Zod schemas in `@nusakerja/validators` and infer types from them.
2. **Statutory Integrity**: Statutory rates (BPJS caps, TER tables) must be read from parameter stores or constants, never hardcoded inline.
3. **Security Checklist**:
   - Validate every tRPC input with a Zod schema.
   - Enforce tenant isolation in queries (`where(eq(schema.tenantId, ctx.tenantId))`).
   - Log sensitive operations to `audit_logs`.
4. **Documentation**: Always update `PROGRESS.md` and `CHANGELOG.md` when completing key tasks.
