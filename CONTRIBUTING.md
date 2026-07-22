# Contributing to NusaKerja

NusaKerja uses one Git repository, one production branch, and short-lived change branches. Open this `nusakerja` directory directly in the editor so Source Control operates on the correct Git root.

## Repository map

- `apps/web/app` — Next.js pages and API routes
- `apps/web/app/(dashboard)` — pages that use the HRMS dashboard shell
- `packages` — shared database, auth, validation, configuration, and UI code
- `scripts` — repeatable project checks and operational scripts
- `saas-foundation` — restored reference foundation and templates; it is not a second Git repository
- Root Markdown files — canonical product, architecture, security, testing, deployment, and progress documentation

## Adding or changing a page

1. Create a short-lived branch: `git switch -c feat/<page-name>`.
2. Put a dashboard page at `apps/web/app/(dashboard)/<route>/page.tsx`.
3. Keep public pages outside the `(dashboard)` route group.
4. Never create two page files that resolve to the same URL. Run `pnpm check:routes` to detect collisions.
5. Run the complete quality gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
6. Commit only the relevant files, push the branch, and open a pull request into `main`.
7. Merge only after CI passes and the preview deployment is checked.

## Commit and merge rules

- Use conventional commit messages such as `feat: add employee directory filters` or `fix: correct payroll export`.
- Keep one coherent change per pull request.
- Do not commit `.env`, `.vercel`, `.next`, `.turbo`, `node_modules`, or `*.tsbuildinfo` files.
- Database changes require a committed Drizzle migration and successful `pnpm db:migrate` verification.
- Update `CHANGELOG.md` and the relevant canonical documentation when behavior or architecture changes.

## Main branch

`main` is the only production branch. Vercel deploys it to `https://nusakerja.vercel.app`. Prepared work that exists only in the editor or on disk is not merged until it is committed and pushed through this workflow.
