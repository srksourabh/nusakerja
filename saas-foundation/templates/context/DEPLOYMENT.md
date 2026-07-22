# Deployment — <project-name>

## Environments

| Environment | URL | Purpose | Approval |
|---|---|---|---|
| Local | <local-url> | development | none |
| Staging | <staging-url> | release validation | <approval> |
| Production | <production-url> | customers | <approval> |

## Release runbook

1. Run lint, typecheck, tests, build, and migration validation.
2. Deploy through CI/CD with required secrets supplied by the platform.
3. Run authenticated and unauthenticated smoke checks plus health checks.
4. Monitor errors and business-critical events; roll back to <rollback-method> if needed.

## Stop conditions and acceptance

- Stop/rollback when: <health, data, security, or business threshold>.
- Go-live approver: <name>.
- Production evidence: link health checks, critical-path smoke results, dashboard,
  and accepted open risks in `PROGRESS.md`.

## Configuration and observability

Secret manager: <secret-manager>. Monitoring: <monitoring>. Logs: <logging>.
