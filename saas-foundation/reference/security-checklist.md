# Security hardening checklist

## Auth
- [ ] Password hashing (Argon2 or bcrypt)
- [ ] Session rotation on login/logout/role upgrade
- [ ] Brute force lockout (5 failures, 15 min)
- [ ] Rate limiting on auth endpoints (10 req/s per IP)
- [ ] OAuth state parameter (CSRF protection)
- [ ] Email verification on signup
- [ ] Password reset flow (time-limited tokens)

## API
- [ ] Input validation (Zod on every mutation)
- [ ] Output sanitization (no PII in responses)
- [ ] Rate limiting per user (100 req/s)
- [ ] CORS whitelist (not `*`)
- [ ] Request size limits (body: 1MB default)
- [ ] Idempotency keys on mutations

## HTTP headers
- [ ] Content-Security-Policy (strict, no `unsafe-inline`)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Strict-Transport-Security (HSTS)
- [ ] Permissions-Policy (camera=(), microphone=(), geolocation=())

## Database
- [ ] No raw SQL (Drizzle ORM only)
- [ ] Connection string has password via env var
- [ ] Migrations reviewed (drizzle-kit)
- [ ] Row-Level Security for multi-tenant (if applicable)

## Secrets
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` has dummy values only
- [ ] No secrets in commit history
- [ ] Secrets rotated on compromise

## Monitoring
- [ ] Audit log for sensitive operations
- [ ] Error monitoring (Sentry)
- [ ] Failed login alerting
- [ ] Dependency scanning (Dependabot weekly)
- [ ] Rate limit breach alerting
