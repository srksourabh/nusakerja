# CLAUDE.md — Claude Code & Cursor Agent Guidelines

> Project: NusaKerja (Indonesian HRMS + Payroll SaaS)

## Key Commands

- `pnpm dev` — Start dev server across monorepo
- `pnpm build` — Build monorepo packages and Next.js app
- `pnpm lint` — ESLint validation
- `pnpm typecheck` — TypeScript type checking
- `pnpm test` — Run Vitest tests
- `pnpm db:push` — Push Drizzle database schema to Postgres

## Code Conventions

- **Module Resolution**: Use `@nusakerja/<package>` alias paths.
- **Components**: Functional components with explicit props interfaces.
- **Language & Culture**: Bahasa Indonesia default user interface with English fallback.
- **Error Handling**: Use structured tRPC error formatters and Pino logger.
