# Full System Audit — Sika Homes (Staging)

**Date:** 2026-07-29  
**Branch:** `repo-reset/new-project-foundation`  
**Staging:** `http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io`  
**Stack:** Next.js 15 + React 19 + plain PostgreSQL (`pg`) + JWT auth + local disk uploads + Moolre payments/SMS

---

## Baseline (before this repair pass)

| Check | Result |
|-------|--------|
| Git branch | `repo-reset/new-project-foundation` @ `6091766` |
| Staging app | Coolify `sikahomes-staging` running |
| Homepage / shop / admin login | HTTP 200 |
| `/api/storefront/products` | **HTTP 500** — `permission denied for table products` |
| `/api/storefront/categories` | **HTTP 500** — same grant failure |
| `/api/auth/me` (anon) | HTTP 401 (expected) |
| Runtime `@supabase/*` imports | None |
| Hubtel / Paystack code | **Not present** in repository |
| Catalog data | Empty (`[]`) after grants fixed |

### Root cause of storefront 500s

Schema (`001_plain_postgres.sql`) was applied as PostgreSQL superuser `postgres`, while the Coolify app connects as `store_sikahomes`. Tables were owned by `postgres` with no grants to the app role → every catalog query failed.

**Fixed on staging:** grants + `REASSIGN OWNED` to `store_sikahomes`; migration `002_grant_app_role.sql` added for future installs.

---

## Architecture summary

| Layer | Implementation |
|-------|----------------|
| DB | Shared `pg` Pool (`lib/db.ts`), `DATABASE_URL` via PgBouncer |
| Auth | JWT HttpOnly cookie `sikahomes_session` (`lib/auth/*`) |
| Admin gate | `middleware.ts` staff JWT check on `/admin/*` |
| Uploads | Disk `UPLOAD_DIR` + `/api/uploads` |
| Payments | **Moolre only** — initiate / callback / verify |
| SMS | Moolre VAS (`lib/notifications.ts`) |
| Email | Resend |
| Data access | Raw SQL in API routes + `lib/data/*` |

---

## Route inventory (high level)

- **Store pages:** 34 (home, shop, product, cart, checkout, auth, account, support, content)
- **Admin pages:** 21 (dashboard, catalog, orders, POS, customers, CMS, SMS test)
- **API routes:** 43 (auth, storefront, catalog, orders, payments, uploads, admin, cron)

Smoke (staging, pages/APIs returning 200 unless noted):

- Public store pages: **working**
- Storefront catalog APIs: **working** (empty data)
- Auth me unauthenticated: **401 expected**
- Moolre callback GET: **ready**
- Cron without secret (pre-deploy): open — **hardened in code** (requires `CRON_SECRET`)

---

## Supabase migration findings

| Feature | Status |
|---------|--------|
| DB queries | Replaced with `pg` |
| Auth | Custom JWT (not Supabase Auth) |
| RLS | Removed; app-layer authz |
| Storage | Local disk uploads |
| Realtime | Not used |
| RPC | SQL functions (`mark_order_paid`, etc.) |
| Edge functions | N/A — Next API routes |

Legacy leftovers cleaned/hardened:

- Removed `sb-access-token` middleware fallback
- Neutralized Mamator brand defaults
- Kept historical `supabase/` SQL on disk (not imported at runtime)

---

## Payment / SMS / security (this pass)

- Payment attempt + callback event tables (`003_payment_attempts.sql`)
- Store Moolre `externalref` on initiate; verify uses stored ref (fixes redirect fallback)
- Amount always from DB order total
- Callback amount check + idempotent paid handling + duplicate event hash
- Order summary no longer returns full PII/line items without email or owning session
- Cron requires `CRON_SECRET`
- External fetch timeouts (payment + SMS)
- Failed payment cannot overwrite already-paid orders

---

## Performance findings

| Area | Finding |
|------|---------|
| Freezing | Catalog 500s caused client error loops / empty shops; fixed by DB grants |
| Slow queries | Empty catalog; indexes already present in `001` for orders/products |
| Bundle | First Load JS ~106 kB shared (production build) |
| Polling | Order-success waits 3s then verifies once (acceptable) |

---

## Remaining risks / manual actions

1. Configure Moolre + Resend + `CRON_SECRET` + `MOOLRE_CALLBACK_SECRET` on Coolify
2. Set `NEXT_PUBLIC_APP_URL` to staging/public URL for correct callbacks
3. Mount persistent `UPLOAD_DIR` volume
4. Seed catalog / create products via admin
5. Hubtel & Paystack **not in codebase** — add only if product requires them
6. Phone/email verify pages remain UI stubs
7. Redeploy staging to pick up application code changes from this audit

---

## Production readiness

**Ready after listed manual actions** — core migration architecture is sound; staging DB grants repaired; payment/SMS hardening landed in repo and requires deploy + credentials.
