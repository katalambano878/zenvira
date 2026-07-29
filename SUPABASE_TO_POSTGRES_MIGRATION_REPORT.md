# Supabase → Plain Postgres Migration Report

**Project:** Sika Homes / sikahomes  
**Pattern:** Mamator Shape B (native `pg`, no Prisma)  
**Guide:** `docs/SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md`

## Features matrix

| Supabase feature | Replacement | Status |
|------------------|-------------|--------|
| PostgREST / supabase-js queries | `lib/db.ts` + SQL in APIs / `lib/data/*` | Complete |
| Supabase Auth | JWT + bcrypt (`lib/auth/*`) | Complete |
| Auth cookies (`sb-*`) | `sikahomes_session` only | Complete (legacy cookie removed) |
| RLS policies | Application authorization in APIs/middleware | Complete (must keep reviewing new routes) |
| Storage buckets | Local disk `UPLOAD_DIR` + `/api/uploads` | Complete |
| Realtime channels | None | N/A |
| Edge Functions | Next.js Route Handlers | Complete |
| RPC | SQL functions in `001_plain_postgres.sql` | Complete |
| Cron (hosted) | `/api/cron/payment-reminders` + `CRON_SECRET` | Complete |

## Schema

- Primary migration: `db/migrations/001_plain_postgres.sql`
- Grants for fleet role: `002_grant_app_role.sql`
- Payment tracking: `003_payment_attempts.sql`
- Runner: `npm run db:migrate` (`scripts/migrate-db.mjs`)

## Remaining Supabase references

- Historical SQL under `supabase/` (documentation / archive only)
- Comments / docs mentioning the migration
- No runtime `@supabase/*` packages

## Data integrity notes (staging)

- Fresh `store_sikahomes` DB — empty catalog after provision
- Ownership must be `store_sikahomes` (or grants equivalent) after applying SQL as postgres
- Do not assume RLS protects anything

## Auth changes

- Users in `public.users` with `encrypted_password`
- Profiles for role (`admin` / `staff` / `customer`)
- Admin middleware validates JWT staff role only
