#!/usr/bin/env bash
set -euo pipefail
TOKEN=$(sudo cat /data/fleet/secrets/coolify-api.token)
APP=koyoh8j5sl0expzajkw847u1
BASE=http://127.0.0.1:8000/api/v1

# List current envs
curl -sS -H "Authorization: Bearer $TOKEN" "$BASE/applications/$APP/envs" > /tmp/sika_envs.json
python3 - <<'PY'
import json
data=json.load(open('/tmp/sika_envs.json'))
items=data if isinstance(data,list) else data.get('data',data)
if isinstance(items, dict):
  items=items.get('data', [])
for e in items:
  k=e.get('key') or e.get('name')
  if k and k.startswith('NEXT_PUBLIC'):
    print(k, '=', (e.get('value') or '')[:60], '| uuid=', e.get('uuid') or e.get('id'))
PY

update() {
  local key="$1" val="$2"
  # try PATCH by key body Coolify v4 style
  resp=$(curl -sS -X POST "$BASE/applications/$APP/envs" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"$key\",\"value\":\"$val\",\"is_preview\":false,\"is_shown_once\":false,\"is_runtime\":true,\"is_buildtime\":true}" || true)
  echo "$key POST => $resp" | head -c 300; echo
}

update NEXT_PUBLIC_SITE_NAME "Sika Homes"
update NEXT_PUBLIC_WORDMARK "Sika Homes"
update NEXT_PUBLIC_SITE_TAGLINE "Furniture, sofas & interiors for beautiful homes in Ghana."
update NEXT_PUBLIC_SMS_SENDER_ID "SIKAHOMES"
update NEXT_PUBLIC_SKU_PREFIX "SIKA"
update NEXT_PUBLIC_CONTACT_EMAIL "hello@sikahomes.com"
update NEXT_PUBLIC_CONTACT_ADDRESS "Ghana"

curl -sS -o /dev/null -w "categories:%{http_code}\n" --max-time 20 http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/storefront/categories
curl -sS --max-time 20 http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io/api/storefront/categories | head -c 400; echo
