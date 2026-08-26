#!/usr/bin/env bash
set -euo pipefail
TOKEN=$(sudo cat /data/fleet/secrets/coolify-api.token)
APP=koyoh8j5sl0expzajkw847u1
API=http://127.0.0.1:8000/api/v1
H=(-H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -H "Accept: application/json")

curl -sS "${H[@]}" "$API/applications/$APP/envs" > /tmp/sika_envs.json
python3 <<'PY'
import json,urllib.request,os
data=json.load(open('/tmp/sika_envs.json'))
items=data if isinstance(data,list) else data.get('data',[])
token=open('/data/fleet/secrets/coolify-api.token').read().strip() if False else None
for e in items:
  k=e.get('key')
  v=e.get('value')
  prev=e.get('is_preview')
  print(f"{k} preview={prev} value={v!r} uuid={e.get('uuid')}")
PY

# Patch ALL SITE_NAME / WORDMARK entries (prod + preview)
python3 <<'PY'
import json, subprocess
data=json.load(open('/tmp/sika_envs.json'))
items=data if isinstance(data,list) else data.get('data',[])
wanted={
  'NEXT_PUBLIC_SITE_NAME':'Sika Homes',
  'NEXT_PUBLIC_WORDMARK':'Sika Homes',
  'NEXT_PUBLIC_SITE_TAGLINE':'Furniture, sofas & interiors for beautiful homes in Ghana.',
}
token=subprocess.check_output(['sudo','cat','/data/fleet/secrets/coolify-api.token'], text=True).strip()
for e in items:
  k=e.get('key')
  if k not in wanted: continue
  if e.get('value') == wanted[k]:
    print('ok', k, 'preview', e.get('is_preview'))
    continue
  payload=json.dumps({
    'key':k,'value':wanted[k],'is_literal':True,'is_multiline':False,
    'is_buildtime':True,'is_runtime':True,'is_preview':bool(e.get('is_preview'))
  })
  cmd=['curl','-sS','-X','PATCH','-H',f'Authorization: Bearer {token}','-H','Content-Type: application/json',
       f'http://127.0.0.1:8000/api/v1/applications/koyoh8j5sl0expzajkw847u1/envs','-d',payload]
  out=subprocess.check_output(cmd, text=True)
  print('patched', k, 'preview', e.get('is_preview'), out[:120])
PY
