# AGENTS.md — Development & Operating Rules for AI Agents

> This document defines the non-negotiable rules, execution boundaries, and definition of ready/done for all developers and AI agents working on NusaKerja.

## 1. Core Principles

1. **Compliance is Configuration, Not Code**: All statutory rates, caps, floors, and brackets must be stored in effective-dated parameters. Never hardcode statutory figures in source code.
2. **Untrusted AI Output**: AI-generated code, tests, and documentation must pass automated typecheck, linting, and human review before merging.
3. **No Breaking API Contracts**: Preserving existing tRPC and database schema signatures is mandatory.

---

## 2. Command Palette

- Build monorepo: `pnpm build`
- Run dev server: `pnpm dev`
- Lint code: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Run unit/integration tests: `pnpm test`
- Database push: `pnpm db:push`
- Scaffold model/page: `pnpm scaffold model <name>`

---

## 3. Definition of Ready (DoR)

Before starting work on any feature:
- Business requirement, risk class, and acceptance criteria are documented in `REQUIREMENTS.md`.
- Data model changes are defined in `DATABASE.md`.
- Security/privacy implications are cleared against `SECURITY.md`.

---

## 4. Definition of Done (DoD)

Before declaring any feature complete:
- All unit/integration tests pass with 0 errors.
- TypeScript compiles strictly with `pnpm typecheck`.
- Audit logging is added for sensitive actions.
- Relevant documentation (`PROGRESS.md`, `CHANGELOG.md`) is updated.
