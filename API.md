# API.md — NusaKerja Interface Contract & tRPC Specs

## 1. API Architecture

NusaKerja uses **tRPC v11** for end-to-end type safety between Next.js and the monorepo packages.

- Base URL: `http://localhost:3000/api/trpc`
- Health Endpoint: `GET /api/health`

---

## 2. Procedure Types

1. `publicProcedure`: Unauthenticated endpoints (login, signup, health check).
2. `protectedProcedure`: Authenticated endpoints verifying active session & tenant context.
3. `adminProcedure`: Restricted endpoints requiring `client_admin`, `reseller_admin`, or `super_admin` role.

---

## 3. Standard Response & Error Envelope

```json
{
  "result": {
    "data": { ... }
  },
  "error": {
    "message": "Human-readable error message",
    "code": -32600,
    "data": {
      "code": "BAD_REQUEST",
      "httpStatus": 400
    }
  }
}
```
