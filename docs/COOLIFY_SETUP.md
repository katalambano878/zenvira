# Coolify setup — Sika Homes

SSH cannot create Coolify apps. Create them in the UI, then deploy with fleet.

## 1. Create apps (Coolify UI)

Suggested names:

- `sikahomes-staging`
- `sikahomes-app` (production, when ready)

Settings (match other stores):

- Build pack: Dockerfile / Nixpacks → **Dockerfile** in repo root
- Port: **3000**
- Branch: `repo-reset/new-project-foundation` (or `main` after merge)
- Persistent volume: host `/var/www/sikahomes/uploads` → container `/var/www/sikahomes/uploads`

## 2. Environment variables

Copy values from the VPS secret file (do not commit):

```bash
ssh big-vps 'sudo cat /data/fleet/secrets/store_sikahomes.env'
```

Set in Coolify (names only listed here):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | PgBouncer URL from `sudo fleet db provision sikahomes` output |
| `AUTH_SECRET` | `openssl rand -base64 48` |
| `AUTH_COOKIE_NAME` | `sikahomes_session` |
| `NEXT_PUBLIC_APP_URL` | Staging sslip URL or production domain |
| `UPLOAD_DIR` | `/var/www/sikahomes/uploads` |
| `NEXT_PUBLIC_UPLOAD_BASE_URL` | `{APP_URL}/uploads` |
| `NEXT_PUBLIC_SITE_NAME` | Your brand |
| `NODE_ENV` | `production` |

Optional later: Resend, Moolre, reCAPTCHA, `CRON_SECRET`.

## 3. Deploy

```bash
sudo fleet deploy sikahomes-staging
# Confirm image SHA matches git:
sudo docker ps --format '{{.Names}} {{.Image}}' | grep -i sika
```

## 4. Admin login

Use credentials from local `.admin-credentials.local` (gitignored), or:

```bash
npm run create-admin -- you@example.com 'strong-password'
```

against `DATABASE_URL`. Open `/admin/login`.

## Related

- [`SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md`](./SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md)
- [`STORE_HARDENING_PLAYBOOK.md`](./STORE_HARDENING_PLAYBOOK.md)
