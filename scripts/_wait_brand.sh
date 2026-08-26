#!/usr/bin/env bash
BASE=http://koyoh8j5sl0expzajkw847u1.169.58.8.203.sslip.io
for i in $(seq 1 40); do
  html=$(curl -sS --max-time 25 "$BASE/" || true)
  if echo "$html" | grep -q "Sika Homes"; then
    echo "HOME_HAS_SIKA_HOMES try=$i"
    echo "$html" | grep -o "Sofas, furniture[^<]*" | head -2
    curl -sS --max-time 15 "$BASE/api/storefront/categories" | python3 -c "import sys,json; d=json.load(sys.stdin); print('categories', len(d), [c['name'] for c in d])"
    exit 0
  fi
  echo "waiting $i ..."
  sleep 15
done
echo "TIMEOUT"
exit 1
