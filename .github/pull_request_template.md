## What changed

Describe the user-visible or engineering change and why it is needed.

## Validation

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Vercel preview checked for UI changes
- [ ] Drizzle migration committed and verified for database changes

## Merge safety

- [ ] The change is focused and contains no generated artifacts or secrets
- [ ] New pages have unique URLs and pass `pnpm check:routes`
- [ ] Relevant documentation and `CHANGELOG.md` are updated
- [ ] Rollback impact is understood
