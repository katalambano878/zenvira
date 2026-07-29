# Sika Homes — Storefront (Plain Postgres)

Next.js e-commerce storefront + admin on **plain Postgres** (no Supabase runtime). Branding and credentials are configured via environment variables.

## Technology stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- Postgres via `pg` (`DATABASE_URL`)
- JWT session cookies (`AUTH_SECRET`, `jose`, `bcryptjs`)
- Disk uploads (`UPLOAD_DIR` → `/uploads`)
- Optional: Resend, Moolre, reCAPTCHA, GA

## Prerequisites

- Node.js 20+
- Postgres (`DATABASE_URL`)
- Optional payment/email/SMS keys

## Installation

```bash
npm install
cp .env.example .env.local
# Set DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL, upload paths
npm run db:migrate
npm run create-admin -- you@example.com 'strong-password'
npm run dev
```

Dev server: `http://localhost:3001`

## Environment

See [`.env.example`](.env.example). Critical vars:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection |
| `AUTH_SECRET` | Session signing |
| `NEXT_PUBLIC_APP_URL` | Canonical URL |
| `UPLOAD_DIR` | Local/VPS upload directory |
| `NEXT_PUBLIC_UPLOAD_BASE_URL` | Public URL prefix for uploads |

## Database

```bash
npm run db:migrate          # applies db/migrations/*.sql
npm run create-admin -- <email> <password>
```

VPS (big-vps): database `store_sikahomes` via `sudo fleet db provision sikahomes`. Secrets live under `/data/fleet/secrets/store_sikahomes.env` — never commit them.

## Build / deploy

```bash
npm run build
npm start                   # port 3000
```

Docker / nginx stubs: `Dockerfile`, `docker-compose.yml`, `deploy/nginx/sikahomes.conf`.

Coolify app must be created in the UI (`sikahomes-staging` / `sikahomes-app`), then:

```bash
sudo fleet deploy sikahomes-staging
```

## Docs

- [`docs/SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md`](docs/SUPABASE_TO_POSTGRES_MIGRATION_GUIDE.md)
- [`docs/STORE_HARDENING_PLAYBOOK.md`](docs/STORE_HARDENING_PLAYBOOK.md)

## Architecture

Browser → Next.js `/api/*` → `lib/db` (`pg`) → Postgres  
Auth: HttpOnly JWT cookie · Files: disk under `UPLOAD_DIR`
