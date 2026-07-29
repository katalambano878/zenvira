# Repository Reset Report

**Branch:** `repo-reset/new-project-foundation`  
**Date:** 2026-07-29  
**Source repo:** former Zenvira / perfume-storefront clone (`ecrimah/zenvira`)

## Summary of cleanup

Converted the branded Zenvira e-commerce storefront into a neutral **New Project** starter. Brand assets, marketing copy, personal socials, demo images (including Readdy.ai URLs), obsolete proposals/logs, and hardcoded Supabase project IDs were removed or replaced. Core commerce, admin, auth, payment/email/SMS architecture, and Supabase schema were preserved and generalized.

## Files removed

### Public brand media
- `public/zenvira-*.png` (heroes/sliders)
- `public/Whisk_*.jpeg` (AI-generated marketing images)
- `public/neww.png`, `public/nhew.png` (old logos)
- `public/hero-slide-3.png`
- `public/PAGE_HERO_IMAGES.txt`

### Obsolete docs / artifacts
- `PROPOSAL.md`, `PROPOSAL-SHOES-BAGS.md`
- `DEPLOY_VERCEL_NEW.md`, `VERCEL_404_FIX.md`
- `SMS_INTEGRATION_STATUS.md`, `SECURITY_AUDIT_PROMPT.md`
- `build_log.txt`, `build_errors.log`
- `tsconfig.tsbuildinfo`
- `supabase/.temp/` (CLI cache)

## Files generalized / cleaned

- `lib/site-defaults.ts` — New Project defaults; empty socials
- `.env.example` — placeholder branding; no personal handles
- `app/(store)/page.tsx` — neutral starter hero + empty-state catalog
- `app/layout.tsx` — `/logo.png`, `noindex`, generic JSON-LD
- `context/CMSContext.tsx` — neutral defaults / logo
- Store pages: about, shop, categories, contact, blog, faqs, help, terms, privacy, shipping, returns, cart, wishlist
- Components: WhoWeAre, Newsletter, PWA*, SEOHead, search/recommendations demos emptied
- Admin login/layout/blog/ProductEditor placeholders
- Checkout / POS / AddressBook — Accra-specific labels generalized
- RLS scripts/docs — env-based Supabase URL placeholders
- `public/manifest.json`, `robots.txt`, `service-worker.js`
- `app/robots.ts`, `app/sitemap.ts` — disallow indexing / empty sitemap
- `.gitignore` — broader secret/dump/upload protections
- `README.md` — starter documentation

## Features preserved

- Next.js App Router storefront + admin dashboard
- Supabase auth, middleware role gate (`admin` / `staff`)
- Cart, wishlist, checkout, order tracking, pay-by-link
- Moolre payment + SMS integration code (credential-gated)
- Resend email notification code (credential-gated)
- reCAPTCHA / GA hooks (optional via env)
- Product import (CSV/ZIP), POS, coupons, inventory, reviews, support tickets
- SQL migrations under `supabase/migrations/` (schema only, no business seed data)
- Scripts: `db:migrate`, `create-admin`, RLS helpers, image compress

## Features removed or neutralized

- Zenvira / spa / perfume marketing content and assets
- Hardcoded blog posts and readdy.ai demo catalogs
- Personal Instagram/YouTube/Snapchat defaults
- Prior domain (`premiumshop.com`) robots entry
- Project proposals and deployment incident notes tied to the old brand
- Production indexing (disabled until new content is ready)

## Database changes

- **No schema drop.** Migrations retained as reusable ecommerce schema.
- **No seed data** for products, customers, orders, or blog was present in SQL; none added.
- Storage bucket definitions in migrations remain generic.
- Hardcoded remote Supabase project ref scrubbed from helper scripts/docs — point at a **new** project for greenfield use.
- Runtime DB contents (if any remote project still holds old data) are out of band; use a fresh Supabase project or wipe data manually.

## Environment-variable changes

| Change | Detail |
|--------|--------|
| Branding defaults | `New Project`, `Build something exceptional.`, `hello@example.com`, `+1 000 000 0000` |
| App URL example | `http://localhost:3001` |
| Social defaults | Removed; optional commented vars only |
| Secrets | Still placeholders only in `.env.example` — no real keys committed in working tree |

## Third-party integrations disabled / gated

| Integration | Notes |
|-------------|-------|
| Moolre | Env empty → do not call live APIs until configured |
| Resend | Requires `RESEND_API_KEY` |
| reCAPTCHA | Scripts load only when site key set |
| Google Analytics | Loads only when measurement ID set |
| Readdy.ai | Demo image URLs removed entirely |

## Security concerns

1. **Historical Supabase project ID** (`bskojprmfxugvkycvetc`) previously appeared in scripts/docs. Removed from current files. If that project is still active, **rotate keys** and restrict access — history may still contain the ID.
2. No live API keys were found in tracked `.env.example`. If any `.env.local` or Vercel env from the old deploy still exists elsewhere, rotate those credentials.
3. Git history was **not** rewritten; old blobs may still contain brand assets or IDs. Treat history as untrusted for secrets.

### Credentials requiring rotation (if still used)

- Supabase anon / service role keys for any former project
- Moolre API user / pubkey / SMS keys
- Resend API key
- reCAPTCHA keys
- `CRON_SECRET`
- Any admin passwords created against the old project

*(Values not printed here.)*

## Items requiring manual review

- Currency defaults remain **GHS / GH₵** for Moolre Ghana payment compatibility — change in CMS/env if the new market differs.
- Phone helper still prefers `+233` when local numbers start with `0` — adjust if launching outside Ghana.
- Delivery method values renamed toward `local` / `pickup`; verify any existing orders in a reused DB that stored `accra` / `doorstep`.
- Replace `public/logo.png` with the real brand mark.
- Rewrite legal pages with counsel-approved copy before launch.
- Confirm MessengerChatButton / LiveSalesNotification behavior (mostly inert) — keep or delete for the new product.
- `@react-google-maps/api` dependency remains; confirm whether maps are needed.

## Recommended next steps

1. Provide new project requirements, branding, and domain.
2. Create a fresh Supabase project; set env; run `npm run db:migrate` and `npm run create-admin`.
3. Replace logo and design tokens as needed.
4. Populate catalog and rewrite content pages.
5. Configure payments/email/SMS.
6. Re-enable robots/sitemap indexing when ready.
7. Optionally purge or archive the old Git remote history if secret rotation alone is insufficient.

## Validation results

| Check | Result |
|-------|--------|
| `npm install` | Passed |
| `npm run lint` | Passed (0 warnings/errors) |
| Typecheck (via `next build`) | Passed |
| Tests | N/A (no test suite) |
| `npm run build` | Passed (63 routes) |
| Database migrations | Not run against a live DB (no credentials); SQL files retained for `npm run db:migrate` |
| Brand string sweep | No Zenvira / premiumshop / readdy / personal socials / old logo paths remaining in app code |

Build note: Supabase clients were made lazy so production build succeeds without `.env.local`.
