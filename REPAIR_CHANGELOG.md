# Repair Changelog — 2026-07-29

## Database

- Applied grants / ownership transfer on staging `store_sikahomes`
- Added `db/migrations/002_grant_app_role.sql`
- Added `db/migrations/003_payment_attempts.sql` (`payment_attempts`, `payment_callback_events`)
- VPS helper scripts: `scripts/_vps_fix_grants.sh`, `scripts/_vps_apply_payment_migration.sh`

## Payment / callbacks / SMS

- `lib/payments/moolre.ts` — external ref helpers, attempt recording, verify, callback events
- `lib/http/fetch-timeout.ts` — aborting fetch helper
- Reworked `app/api/payment/moolre/{route,callback,verify}`
- Cron now always requires `CRON_SECRET`
- SMS send uses timeout + neutral sender defaults

## Security / auth

- Removed legacy `sb-access-token` from middleware
- `/api/orders/summary` returns minimal fields unless email match or owning session
- Checkout/pay no longer send client `amount` for payment init

## Branding

- Neutralized Mamator defaults via `lib/site-defaults` / `lib/site-brand`

## Tests / tooling

- `npm run test:payments` → `scripts/test-moolre-helpers.mjs`
- Staging smoke script: `scripts/_smoke_staging.sh`
- `.env.example` documents required `CRON_SECRET`

## Docs

- `FULL_SYSTEM_AUDIT.md`
- `SUPABASE_TO_POSTGRES_MIGRATION_REPORT.md`
- `PAYMENT_AND_CALLBACK_AUDIT.md`
- `PERFORMANCE_REPORT.md`
- This file

## Packages

- None added/removed this pass
