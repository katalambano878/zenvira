#!/usr/bin/env bash
BASE="${1:-http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io}"
paths=(
  "/" "/shop" "/categories" "/cart" "/checkout" "/contact" "/about" "/faqs"
  "/help" "/blog" "/wishlist" "/order-tracking" "/auth/login" "/auth/signup"
  "/admin/login" "/privacy" "/terms" "/shipping" "/returns"
  "/api/storefront/products" "/api/storefront/categories" "/api/storefront/blog"
  "/api/settings" "/api/payment/moolre/callback" "/api/auth/me"
)
for p in "${paths[@]}"; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 20 "${BASE}${p}" || echo ERR)
  echo "$code $p"
done
