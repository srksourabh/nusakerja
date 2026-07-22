# DEPLOYMENT.md — NusaKerja Deployment & Operating Runbook

## 1. Target Environments

- **Production**: Vercel (Next.js Web app) + Managed PostgreSQL (Supabase/Neon/AWS RDS) + Managed Redis (Upstash/AWS ElastiCache).
- **Staging / Docker**: Docker Compose local & staging containers.

---

## 2. CI/CD Pipeline (`.github/workflows/ci.yml`)

1. **Linting**: ESLint flat config validation.
2. **Typecheck**: `tsc --noEmit` across all workspace packages.
3. **Automated Testing**: Vitest test runner execution.
4. **Build Verification**: Turbo production build verification.

---

## 3. Rollback Procedure

In case of deployment failure:
1. Trigger Vercel instant deployment rollback to previous deployment hash.
2. If database schema was migrated forward, execute Drizzle down migration or apply forward-fix patch.
