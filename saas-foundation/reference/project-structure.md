# Directory structure reference

## Monorepo anatomy

```
<project-name>/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/           # Route group: unauthenticated
│       │   │   ├── login/
│       │   │   └── signup/
│       │   ├── (dashboard)/      # Route group: authenticated
│       │   │   ├── layout.tsx     # Sidebar + header shell
│       │   │   └── page.tsx       # Dashboard home
│       │   ├── api/
│       │   │   ├── trpc/         # tRPC HTTP handler
│       │   │   └── auth/         # NextAuth handler
│       │   ├── layout.tsx        # Root layout (providers)
│       │   └── page.tsx          # Landing page
│       ├── components/           # shadcn/ui + custom components
│       ├── trpc/                 # tRPC router definitions
│       ├── e2e/                  # Playwright tests
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared components
│   │   ├── src/
│   │   │   ├── ui/              # shadcn components
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── db/                       # Database layer
│   │   ├── src/
│   │   │   ├── schema/          # Drizzle table definitions
│   │   │   ├── index.ts         # Client + re-exports
│   │   │   └── __tests__/       # Integration tests
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── auth/                     # Auth configuration
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   └── package.json
│   │
│   ├── validators/               # Shared Zod schemas
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── common.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── email/                    # React Email templates
│   │   ├── src/
│   │   │   ├── templates/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                   # Shared configuration
│       ├── src/
│       │   ├── env.ts            # Zod env validation
│       │   ├── constants.ts
│       │   ├── errors.ts         # Custom error classes
│       │   └── logger.ts         # Pino logger
│       └── package.json
│
├── tooling/
│   ├── eslint/                   # Shared ESLint flat config
│   │   ├── base.js
│   │   ├── next.js
│   │   └── package.json
│   └── typescript/               # Shared tsconfig bases
│       ├── base.json
│       ├── next.json
│       └── package.json
│
├── scripts/                      # Scaffolding generators
│   ├── scaffold.ps1
│   └── templates/
│
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── docs/
│   ├── memory.md
│   ├── progress.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── CONTRIBUTING.md
│   └── ADR/
│       └── adr-template.md
│
├── CLAUDE.md
├── .env.example
├── .gitignore
├── package.json                  # Root workspace
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── vitest.workspace.ts
└── playwright.config.ts
```

## Package alias map

| Alias | Package | Path |
|-------|---------|------|
| `@ui` | `@<project-name>/ui` | `packages/ui/src` |
| `@db` | `@<project-name>/db` | `packages/db/src` |
| `@auth` | `@<project-name>/auth` | `packages/auth/src` |
| `@validators` | `@<project-name>/validators` | `packages/validators/src` |
| `@email` | `@<project-name>/email` | `packages/email/src` |
| `@config` | `@<project-name>/config` | `packages/config/src` |
