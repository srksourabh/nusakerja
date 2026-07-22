# TESTING.md — NusaKerja Test Strategy & Quality Gates

## 1. Test Pyramid

1. **Unit Tests**: Vitest for validators (`packages/validators`), statutory formulas, and utility methods. Target: >80% line coverage.
2. **Integration Tests**: Vitest + Drizzle ORM testing database schema operations against PostgreSQL.
3. **E2E Tests**: Playwright (`apps/web/e2e`) verifying signup, login, protected routes, and mobile attendance.

---

## 2. Execution Commands

- Run unit & integration tests: `pnpm test`
- Run E2E tests: `pnpm --filter @nusakerja/web test:e2e`
- Check test coverage: `pnpm test -- --coverage`

---

## 3. Release Quality Gates (G1–G7)

- **G1**: 100% statutory payroll calculation match on acceptance test suite.
- **G2**: Zero TypeScript type errors (`pnpm typecheck`).
- **G3**: 0 linting violations (`pnpm lint`).
- **G4**: Playwright E2E test suite passing green.
