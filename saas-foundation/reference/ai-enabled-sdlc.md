# AI-enabled SDLC operating baseline

Use this reference for every generated project. It turns the project context
files into a working engineering system, not a documentation exercise.

## Non-negotiable principles

1. **Business value first.** Link each change to a user, operational, regulatory,
   or commercial outcome.
2. **One accountable owner.** Name an owner for every requirement, risk,
   component, release, and incident.
3. **Security and privacy by design.** Evaluate data, access, threats, and
   obligations before implementation.
4. **Evidence over assertion.** Requirements, review, tests, scans, approvals,
   deployment, and observed behaviour prove completion.
5. **Small, reversible change.** Keep diffs focused; define migration,
   compatibility, feature-flag, and rollback paths when relevant.
6. **Automation with control.** Automate repeatable checks; preserve authorised
   human approval for material risk, production access, releases, and exceptions.
7. **AI-assisted engineering.** Treat AI output as untrusted until independent
   review and validation. An AI tool must never approve its own output, weaken a
   control, access unapproved data, or independently deploy a material change.
8. **Traceability.** Link intent -> requirement -> decision/design -> code ->
   test -> review -> release -> observed outcome.
9. **Continuous improvement.** Feed incidents, defects, customer feedback, cost,
   and operational metrics into the backlog and decisions.

## Risk classification and control scaling

Classify the project and each material change before implementation. Record the
class, rationale, owner, and required evidence in `SECURITY.md`, `TESTING.md`,
`DEPLOYMENT.md`, and `PROGRESS.md`.

| Class | Typical use | Minimum assurance | Production control |
|---|---|---|---|
| A - critical | payments, regulated/sensitive data, safety, core operations | independent security, privacy, resilience, and performance evidence | segregated duties, controlled window, tested rollback, enhanced monitoring |
| B - significant | customer-facing or material data/availability dependency | comprehensive functional and risk-based non-functional evidence | protected pipeline, approval, rollback |
| C - standard | normal product increment or bounded internal app | automated tests, peer review, risk checks | standard pipeline and smoke test |
| D - experimental | isolated prototype with no sensitive/customer production use | basic validation and explicit limitations | no production use until reclassified |

Do not lower a required control without a dated, named, authorised risk exception
in `DECISIONS.md`.

## Lifecycle gates

Gates are evidence-based decisions, not meetings. Projects can work iteratively,
but may not cross a relevant gate without its evidence.

| Gate | Decision | Minimum evidence |
|---|---|---|
| G1 | Business approval | problem, owner, scope, success metric, risk class |
| G2 | Requirements approval | prioritised requirements, acceptance criteria, roles, NFRs, traceability baseline |
| G3 | Design and risk approval | architecture, data/API design, threat/privacy review, test/deployment strategy, major ADRs |
| G4 | Build complete | focused reviewed implementation, tests, migrations, documentation, build artefact |
| G5 | Quality and security approval | functional/non-functional, security, accessibility, privacy, and residual-risk evidence |
| G6 | Release approval | scope, change plan, environment readiness, migration, communications, rollback, accountable approver |
| G7 | Go-live acceptance | production smoke evidence, monitoring, business acceptance, support ownership, open-risk acknowledgement |

## Definition of ready

Before implementation, confirm:

- Business purpose, in/out scope, accountable owner, and acceptance criteria are clear.
- Roles, permissions, dependencies, risk classification, and data constraints are known.
- Design direction, test expectations, AI data/access limits, implementer, and independent reviewer are named.

## Definition of done

Before reporting completion, confirm:

- Each acceptance criterion has evidence; only intended files, dependencies, and
  migrations changed.
- Independent review and all applicable build, type, lint, unit, integration,
  end-to-end, security, accessibility, performance, privacy, and resilience
  checks have passed or have a documented authorised exception.
- Documentation, traceability, release/rollback, monitoring, and service ownership
  are updated proportionately to the change.

## Required task brief

Use this format for every non-trivial task and for AI-assisted work:

```text
Objective and business reason:
Current and required behaviour:
In scope / out of scope:
Affected users and roles:
Relevant files, modules, and context documents:
Risk class; security, privacy, and data constraints:
Acceptance criteria:
Plan, tests, validation commands, migration/rollback:
Prohibited actions and AI access/data constraints:
Expected completion report: files, behaviour, evidence, risks, docs, rollback.
```

## PR and release discipline

Every change links to a requirement, defect, or risk treatment; is focused;
aligns with an ADR or records one; evaluates security/privacy, dependencies,
observability, compatibility, migration, documentation, and rollback. Release
evidence additionally verifies scope, environment/secrets, capacity, monitoring,
communications, smoke tests, and post-release ownership.

## Technology decision rule

Select technologies against requirements and operational constraints, not fashion.
For each material choice, record alternatives, team capability, vendor lock-in,
security, performance, cost, maturity, migration/exit path, and the reversal
cost in `DECISIONS.md`. Avoid adding a service, database, queue, ORM, framework,
or abstraction until it has a concrete requirement and a named operating owner.
