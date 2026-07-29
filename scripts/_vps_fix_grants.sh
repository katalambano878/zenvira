#!/usr/bin/env bash
set -euo pipefail
sudo docker cp /tmp/002_grant_app_role.sql fleet-postgres:/tmp/002_grant_app_role.sql
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 -f /tmp/002_grant_app_role.sql
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 <<'SQL'
ALTER DATABASE store_sikahomes OWNER TO store_sikahomes;
REASSIGN OWNED BY postgres TO store_sikahomes;
SQL
echo "Grants + ownership transfer complete"
curl -sS --max-time 20 -o /tmp/products.json -w "products:%{http_code}\n" http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/storefront/products
curl -sS --max-time 20 -o /tmp/cats.json -w "categories:%{http_code}\n" http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/storefront/categories
head -c 300 /tmp/products.json; echo
head -c 300 /tmp/cats.json; echo
