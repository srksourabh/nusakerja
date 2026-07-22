# Security — <project-name>

## Data and access

- Data classification: <classification>
- Authentication: <auth-method>
- Authorization: <roles-and-tenancy-boundary>

## Required controls

- Validate all untrusted input at the boundary.
- Enforce authorization server-side for every data operation.
- Keep secrets in the deployment secret manager; commit only examples.
- Use TLS, secure headers, rate limits, audit logging, dependency scanning, and least privilege.

## Threat and AI review

- Trust boundaries and abuse cases: <link or summary>
- Privacy/retention/residency obligations: <requirements>
- Approved AI tools and permitted data: <tools and classification>
- AI product controls if applicable: evaluation, guardrails, human override,
  fallback, monitoring, and rollback.

## Incident readiness

Owner: <owner>. Detection: <monitoring>. Response and rollback: see `DEPLOYMENT.md`.
