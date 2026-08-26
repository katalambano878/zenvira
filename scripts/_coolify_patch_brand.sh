#!/usr/bin/env bash
set -euo pipefail
TOKEN=$(sudo cat /data/fleet/secrets/coolify-api.token)
APP=koyoh8j5sl0expzajkw847u1
API=http://127.0.0.1:8000/api/v1
H=(-H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Accept: application/json")

upsert() {
  local key="$1" value="$2"
  local payload
  payload=$(python3 -c "import json; print(json.dumps({'key':'''$key''','value':'''$value''','is_literal':True,'is_multiline':False,'is_buildtime':True,'is_runtime':True,'is_preview':False}))")
  # safer with jq if available
  if command -v jq >/dev/null; then
    payload=$(jq -n --arg k "$key" --arg v "$value" '{key:$k,value:$v,is_literal:true,is_multiline:false,is_buildtime:true,is_runtime:true,is_preview:false}')
  fi
  resp=$(curl -sS -X PATCH "${H[@]}" "$API/applications/$APP/envs" -d "$payload")
  echo "$key PATCH => $resp"
}

upsert NEXT_PUBLIC_SITE_NAME "Sika Homes"
upsert NEXT_PUBLIC_WORDMARK "Sika Homes"
upsert NEXT_PUBLIC_SITE_TAGLINE "Furniture, sofas & interiors for beautiful homes in Ghana."
upsert NEXT_PUBLIC_SMS_SENDER_ID "SIKAHOMES"
upsert NEXT_PUBLIC_SKU_PREFIX "SIKA"
upsert NEXT_PUBLIC_CONTACT_EMAIL "hello@sikahomes.com"
upsert NEXT_PUBLIC_CONTACT_ADDRESS "Ghana"

curl -sS "${H[@]}" "$API/applications/$APP/envs" | python3 -c "import sys,json; d=json.load(sys.stdin);
items=d if isinstance(d,list) else d.get('data',[]);
[print(e.get('key'), '=', (e.get('value') or '')[:70]) for e in items if str(e.get('key','')).startswith('NEXT_PUBLIC_SITE') or e.get('key') in ('NEXT_PUBLIC_WORDMARK','NEXT_PUBLIC_SITE_TAGLINE')]"

sudo fleet deploy sikahomes-staging 2>&1 | tail -12
