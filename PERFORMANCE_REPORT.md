# Performance Report

## Baseline (staging, 2026-07-29)

| Endpoint | Before | After grants |
|----------|--------|--------------|
| `/` | ~0.6s, 200 | 200 |
| `/api/storefront/products` | **500** (ACL) | **200** `[]` |
| `/api/storefront/categories` | **500** | **200** `[]` |

Production build: shared First Load JS ≈ **106 kB**; middleware ≈ **38 kB**.

## Freezing / slowness causes

1. **Catalog APIs 500** — client shop/home fetch failed repeatedly; primary “broken site” symptom after migration.
2. **Missing external timeouts** — Moolre payment/SMS could hang Node handlers (fixed with `fetchWithTimeout`).
3. **Empty catalog** — pages “work” but feel empty until products are imported (not a perf bug).

## Database

- Indexes already defined in `001` for products, orders, payments-related columns.
- Added `payment_attempts` / `payment_callback_events` with reference/status indexes.
- No EXPLAIN ANALYZE on large datasets (staging empty).

## Frontend

- Heavy client checkout/admin pages retained from template; no large rewrite this pass.
- Order-success single verification path (3s wait + one verify) — avoids tight polling loops.

## Recommendations

1. Persist uploads volume (avoid Coolify ephemeral disk).
2. Enable CDN/static caching for public product images after catalog exists.
3. Add pagination audit on admin list endpoints once data volume grows.
4. Set PgBouncer pool sizes per Coolify concurrency.
