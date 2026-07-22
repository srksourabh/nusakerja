# Architecture — <project-name>

## Selected stack

<selected-stack-and-why>

## System flow

`User -> <client> -> <api> -> <auth-and-validation> -> <data-and-services>`

## Components and boundaries

| Component | Responsibility | Depends on |
|---|---|---|
| <component> | <responsibility> | <dependencies> |

## Repository layout

```text
<repository-layout>
```

## Key trade-offs

Link significant choices to `DECISIONS.md`.

## Operational qualities

| Quality | Target | Design/control | Evidence |
|---|---|---|---|
| Availability and recovery | <target> | <design> | <test/dashboard> |
| Performance and scale | <target> | <capacity approach> | <test> |
| Security and privacy | <target> | see SECURITY.md | <review/test> |
| Operability | <target> | logging, metrics, alerts, runbook | <links> |
