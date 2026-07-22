# User profile — <project-name>

> This file defines the user's context, preferences, and communication style
> so AI agents can tailor their interactions accordingly.
>
> Platform: OpenClaw / Hermes

## About the user

- **Role**: <user-role>
- **Technical level**: <expert / intermediate / beginner, non-technical if applicable>
- **Goal**: <what the user is trying to achieve with this project>

## Communication preferences

- **Explanation depth**: Explain the "what" and "why" of every change in plain English.
  Avoid jargon unless it matches the user's technical level.
- **Decision transparency**: State assumptions explicitly. If uncertain, ask.
  If multiple approaches exist, present them ranked with trade-offs.
- **Simplicity preference**: Push back when a simpler approach exists. Don't over-engineer.
- **Progress style**: Status updates via `progress.md`. Session summaries via `memory.md`.
  No self-congratulatory language.

## Project context

- **What this project is**: <one-line description>
- **Who it serves**: <target audience>
- **Key success metric**: <what "done" looks like>
- **Timeline**: <any deadlines or milestones>

## Common requests

When the user asks for something, assume they want:
- **Security**: Applied by default (CSP, rate limiting, RBAC, audit logging). No exceptions.
- **Simplicity**: Minimum code that solves the problem. Nothing speculative.
- **Tests**: Included with every feature. Verify with `pnpm test`.
- **Documentation**: Every feature creates or updates relevant `.md` files.
- **Surgical changes**: Touch only what the task requires. Do not improve adjacent code.

## Expertise areas

The user is comfortable with:
- [ ] TypeScript / JavaScript
- [ ] React / Next.js
- [ ] Database design
- [ ] DevOps / CI/CD
- [ ] Security concepts
- [ ] UI/UX design

## Quick reference

| Question | Answer |
|----------|--------|
| Preferred commit style | Conventional commits (`feat:`, `fix:`, `chore:`) |
| Branch naming | `feat/feature-name`, `fix/bug-name` |
| Preferred communication | Direct, bullet points, trade-offs presented |
| Testing expectation | Tests required for every PR |
| Documentation expectation | `.md` files updated with every feature |
