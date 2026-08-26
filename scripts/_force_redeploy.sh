#!/usr/bin/env bash
set -euo pipefail
TOKEN=$(sudo cat /data/fleet/secrets/coolify-api.token)
curl -sS -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  http://127.0.0.1:8000/api/v1/deploy \
  -d '{"uuid":"koyoh8j5sl0expzajkw847u1","force":true}'
echo
sudo fleet deploy sikahomes-staging 2>&1 | tail -10
