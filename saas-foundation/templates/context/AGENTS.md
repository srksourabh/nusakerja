# Agent Operating Guide — <project-name>

## Read first

Read `README.md`, `PRODUCT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`,
`SECURITY.md`, `TESTING.md`, `DEPLOYMENT.md`, `DECISIONS.md`, and `PROGRESS.md`
before changing code. Do not begin implementation until the task meets the
Definition of Ready below.

## Repository map

<repository-map>

## Non-negotiable rules

- Implement the smallest complete change that satisfies an accepted requirement.
- Classify the change as A (critical), B (significant), C (standard), or D
  (experimental) and scale review, evidence, and release controls accordingly.
- Link intent -> requirement -> design/decision -> code -> tests -> review ->
  release -> observed result. Record the links in the relevant context files.
- Validate with the commands below before reporting completion; report the exact
  evidence, not an assertion that work is done.
- Never commit secrets, weaken auth, bypass authorization, or expose customer data.
- Treat AI-generated output as untrusted. Never allow an AI to approve its own
  work, access unapproved data, weaken a control, or authorise a material merge,
  release, production action, or risk exception.
- Keep migrations reviewed, versioned, tested against representative data, and
  paired with compatibility and rollback/forward-fix plans where relevant.
- Update the relevant context file and `PROGRESS.md` when behaviour,
  architecture, risk, ownership, or status changes.

## Definition of Ready

- [ ] Business reason, scope, owner, risk class, and testable acceptance criteria are clear.
- [ ] Affected roles, data/security/privacy constraints, dependencies, and rollback impact are known.
- [ ] Design direction, validation plan, AI data/access limits, implementer, and independent reviewer are named.

## Definition of Done

- [ ] Every acceptance criterion has evidence and the diff is focused.
- [ ] Required review, build, tests, scans, and applicable non-functional checks pass or have an authorised exception.
- [ ] Documentation, traceability, deployment/rollback, monitoring, and ownership are updated proportionately.

## Commands

```bash
<dev-command>
<lint-command>
<typecheck-command>
<test-command>
<build-command>
```

## Security boundaries

<authz-data-and-secret-boundaries>
