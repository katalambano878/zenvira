#!/usr/bin/env bash
set -euo pipefail
sed -i 's/\r$//' /tmp/004_seed_furniture_categories.sql || true
sudo docker cp /tmp/004_seed_furniture_categories.sql fleet-postgres:/tmp/004_seed_furniture_categories.sql
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 -f /tmp/004_seed_furniture_categories.sql
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -v ON_ERROR_STOP=1 -c "INSERT INTO schema_migrations (id) VALUES ('004_seed_furniture_categories.sql') ON CONFLICT DO NOTHING; GRANT ALL ON ALL TABLES IN SCHEMA public TO store_sikahomes;"
sudo docker exec fleet-postgres psql -U postgres -d store_sikahomes -c "SELECT name, slug, position FROM categories ORDER BY position;"
