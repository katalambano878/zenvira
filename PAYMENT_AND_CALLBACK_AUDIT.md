# Payment and Callback Audit

## Gateways in this repository

| Gateway | Present | Notes |
|---------|---------|-------|
| **Moolre** | Yes | Initiate, callback, verify, POS/checkout UI |
| **Hubtel** | No | Not implemented — out of scope unless added |
| **Paystack** | No | Not implemented — out of scope unless added |

---

## Moolre flow

1. Checkout/POS creates order with server-calculated `total`
2. `POST /api/payment/moolre` loads order from DB (ignores client amount)
3. Creates unique `externalref` = `{order_number}-R{timestamp}`
4. Persists attempt in `payment_attempts` + `orders.metadata.payment_external_ref`
5. Customer pays on Moolre embed URL
6. Browser redirect → `/order-success?order=...&payment_success=true` (not trusted alone)
7. Moolre `POST /api/payment/moolre/callback` (primary confirmation)
8. Fallback: `POST /api/payment/moolre/verify` checks Moolre status using **stored** external ref, then `order_number`
9. Server compares amount to order total (±0.01)
10. `mark_order_paid` updates order once; stock reduction via SQL function
11. Confirmation SMS/email after verified success

### Routes

| Route | Method | Auth | Status |
|-------|--------|------|--------|
| `/api/payment/moolre` | POST | Rate-limited | Initiation |
| `/api/payment/moolre/callback` | POST/GET | Optional `MOOLRE_CALLBACK_SECRET` | Callback |
| `/api/payment/moolre/verify` | POST | Rate-limited | Server verify |

### Controls

| Control | Status |
|---------|--------|
| Amount from server order | Yes |
| Signature / shared secret | Yes when `MOOLRE_CALLBACK_SECRET` set — **must set in prod** |
| Idempotent paid handling | Yes |
| Duplicate callback hash | Yes (`payment_callback_events`) |
| Failed callback cannot un-pay | Yes (`payment_status <> paid` guard) |
| Fetch timeouts | Yes (15–20s) |
| Live payment E2E | **Manual** — needs sandbox credentials |

### Hubtel / Paystack

**N/A — not in codebase.** Do not configure callback URLs for gateways that do not exist.

---

## SMS (Moolre)

- Sender: `lib/notifications.ts` → `sendSMS`
- Auth: `MOOLRE_SMS_API_KEY` or `MOOLRE_API_KEY`
- Sender ID: `MOOLRE_SMS_SENDER_ID` / `NEXT_PUBLIC_SMS_SENDER_ID`
- Timeout: 15s
- Admin test: `/admin/test-sms`
- Cron reminders: require `CRON_SECRET`
- Phone verify UI: stub (no OTP API yet)

Live SMS not exercised in this audit (no authorization to send).
