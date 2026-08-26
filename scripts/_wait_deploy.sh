#!/usr/bin/env bash
set -euo pipefail
BASE=http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io
for i in $(seq 1 36); do
  code=$(curl -sS -o /tmp/cron_body.txt -w "%{http_code}" --max-time 20 "$BASE/api/cron/payment-reminders" || echo 000)
  body=$(head -c 120 /tmp/cron_body.txt || true)
  echo "try $i cron=$code body=$body"
  # After deploy, cron without bearer should be 401
  if [ "$code" = "401" ]; then
    echo "DEPLOYED_HARDENING_OK"
    curl -sS -o /dev/null -w "products:%{http_code}\n" --max-time 20 "$BASE/api/storefront/products"
    curl -sS -o /dev/null -w "home:%{http_code}\n" --max-time 20 "$BASE/"
    exit 0
  fi
  sleep 10
done
echo "TIMEOUT_WAITING_FOR_DEPLOY"
exit 1
