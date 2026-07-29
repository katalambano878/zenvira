#!/usr/bin/env bash
set -euo pipefail
sed -i 's/\r$//' /tmp/002_grant_app_role.sql /tmp/003_payment_attempts.sql || true
sudo docker cp /tmp/002_grant_app_role.sql fleet-postgres:/tmp/002_grant_app_role.sql
sudo docker cp /tmp/003_payment_attempts.sql fleet-postgres:/tmp/003_payment_attempts.sql

sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO schema_migrations (id) VALUES ('002_grant_app_role.sql')
ON CONFLICT (id) DO NOTHING;
SQL

sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 -f /tmp/003_payment_attempts.sql
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO schema_migrations (id) VALUES ('003_payment_attempts.sql')
ON CONFLICT (id) DO NOTHING;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO store_sikahomes;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO store_sikahomes;
SQL

echo "OK"
curl -sS -o /dev/null -w "products:%{http_code}\n" --max-time 20 http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/storefront/products
curl -sS -o /dev/null -w "callback:%{http_code}\n" --max-time 20 http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/payment/moolre/callback
curl -sS -o /dev/null -w "cron:%{http_code}\n" --max-time 20 http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/cron/payment-reminders
