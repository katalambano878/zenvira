#!/usr/bin/env bash
set -euo pipefail
TOKEN=$(sudo cat /data/fleet/secrets/coolify-api.token)
APP=koyoh8j5sl0expzajkw847u1
BASE=http://127.0.0.1:8000/api/v1

# Update branding env vars (merge with existing by posting known keys)
update_env() {
  local key="$1" val="$2"
  curl -sS -X PATCH "$BASE/applications/$APP/envs" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"$key\",\"value\":\"$val\",\"is_preview\":false,\"is_literally\":false,\"is_shown_once\":false,\"is_runtime\":true,\"is_buildtime\":true}" \
    | head -c 200
  echo " <- $key"
}

update_env NEXT_PUBLIC_SITE_NAME "Sika Homes"
update_env NEXT_PUBLIC_WORDMARK "Sika Homes"
update_env NEXT_PUBLIC_SITE_TAGLINE "Furniture, sofas & interiors for beautiful homes in Ghana."
update_env NEXT_PUBLIC_SMS_SENDER_ID "SIKAHOMES"
update_env NEXT_PUBLIC_SKU_PREFIX "SIKA"
update_env NEXT_PUBLIC_CONTACT_EMAIL "hello@sikahomes.com"
update_env NEXT_PUBLIC_CONTACT_ADDRESS "Ghana"

echo "Branding env updated"
