# Database — <project-name>

## Platform and ownership

- Datastore: <database-stack>
- Migration command: `<migration-command>`
- Data owner and access model: <owner-and-access>

## Entity plan

| Entity | Purpose | Tenant/access key | Retention |
|---|---|---|---|
| <entity> | <purpose> | <key> | <retention> |

## Operational rules

- Migrations are reviewed, reversible where practical, and run through CI/CD.
- Indexes, backups, restoration testing, encryption, and deletion rules are defined before production data is stored.
- Production breaking changes use an approved compatibility plan (for example,
  expand-migrate-contract) and have reconciliation plus rollback/forward-fix evidence.
