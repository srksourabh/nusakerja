# API — <project-name>

## Contract

- Style: <api-style>
- Base URL/versioning: <base-url-and-versioning>
- Authentication and authorization: <auth-contract>
- Error format: <error-envelope>

## Interface inventory

| Method/event | Path/name | Purpose | Auth | Status |
|---|---|---|---|---|
| <method> | <path> | <purpose> | <access> | planned |

## Rules

Validate inputs, return stable error codes, document pagination/filtering, and define idempotency and rate limits for writes.

Record backward-compatibility, deprecation, timeout/retry, failure-isolation, and
observability requirements for every external or business-critical interface.
