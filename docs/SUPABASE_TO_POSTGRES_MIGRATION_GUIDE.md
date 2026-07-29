# Supabase → Plain Postgres (VPS) — Sika Homes

Adapted from the Mamator playbook. **No secrets in this doc.**

## Project status (2026-07-29)

| Item | Status |
|------|--------|
| Architecture | Shape B — native `lib/db` + `/api/*` (Mamator pattern) |
| Runtime `@supabase/*` | Target: **zero** in `app/`, `components/`, `context/`, `lib/`, `middleware` |
| Schema | `db/migrations/001_plain_postgres.sql` |
| Auth | JWT HttpOnly cookie (`AUTH_SECRET`, `sikahomes_session`) + `public.users` / `profiles` |
| Uploads | `UPLOAD_DIR` → `/uploads` via nginx or `/api/uploads` |
| Data | Greenfield `store_sikahomes` (no Supabase dump) — **provisioned** on big-vps; schema applied |
| Coolify app | Create in UI (`sikahomes-staging` / `sikahomes-app`) — cannot create from SSH |
| Domain | Placeholder `example.com` until production URL is set |
| Uploads dir | `/var/www/sikahomes/uploads` created on VPS |

## Environment mapping

| Old (Supabase) | New |
|----------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_APP_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(removed)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(removed)* |
| *(implicit)* | `DATABASE_URL` |
| *(implicit JWT)* | `AUTH_SECRET` |
| Storage buckets | `UPLOAD_DIR` + `NEXT_PUBLIC_UPLOAD_BASE_URL` |

See `.env.example`.

## VPS steps

```bash
ssh big-vps
sudo fleet db provision sikahomes
# Set DATABASE_URL in Coolify from provision output — do not commit it
```

```bash
npm run db:migrate
npm run create-admin -- admin@example.com 'your-strong-password'
sudo fleet deploy sikahomes-staging   # after Coolify app exists
```

Uploads host path: `/var/www/sikahomes/uploads`

## Cutover order (completed in repo)

1. DB layer — `lib/db.ts`
2. Auth — `lib/auth/*`, middleware, `/api/auth/*`
3. Storefront / catalog / orders APIs
4. Admin via `/api/catalog`, `/api/admin`, `/api/orders`
5. Payments / notifications / cron on `pg`
6. Remove `@supabase/*` from runtime

## Related

- [`STORE_HARDENING_PLAYBOOK.md`](./STORE_HARDENING_PLAYBOOK.md)
- Mamator reference: `websites/mamator/docs/SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md`
