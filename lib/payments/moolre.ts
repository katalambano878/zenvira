import { query, queryOne } from '@/lib/db';
import { fetchWithTimeout } from '@/lib/http/fetch-timeout';

export type MoolreStatusResult = {
  verified: boolean;
  amount: number | null;
  currency: string | null;
  gatewayStatus: string | null;
  rawCode: number | null;
};

/** Strip attempt suffix: ORD-123-456-R1710000000000 → ORD-123-456 */
export function stripPaymentAttemptSuffix(externalRef: string): string {
  return String(externalRef || '').replace(/-R\d+$/, '');
}

export function isSuccessfulMoolreStatus(status: unknown): boolean {
  const statusStr = String(status || '').toLowerCase();
  return (
    statusStr === 'success' ||
    statusStr === 'successful' ||
    statusStr === 'completed' ||
    statusStr === 'paid'
  );
}

export async function recordPaymentAttempt(params: {
  orderId: string;
  orderNumber: string;
  externalRef: string;
  amount: number;
  currency?: string;
  gatewayReference?: string | null;
  rawInit?: unknown;
}): Promise<void> {
  await query(
    `
    INSERT INTO payment_attempts (
      order_id, order_number, gateway, external_ref, amount_expected, currency,
      status, gateway_reference, initiation_payload
    ) VALUES ($1::uuid, $2, 'moolre', $3, $4, $5, 'pending', $6, $7::jsonb)
    ON CONFLICT (external_ref) DO UPDATE SET
      updated_at = now(),
      gateway_reference = COALESCE(EXCLUDED.gateway_reference, payment_attempts.gateway_reference)
    `,
    [
      params.orderId,
      params.orderNumber,
      params.externalRef,
      params.amount,
      params.currency || 'GHS',
      params.gatewayReference || null,
      JSON.stringify(params.rawInit ?? {}),
    ]
  );

  await query(
    `
    UPDATE orders SET
      metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb,
      updated_at = now()
    WHERE id = $1::uuid
    `,
    [
      params.orderId,
      JSON.stringify({
        payment_method: 'moolre',
        payment_external_ref: params.externalRef,
        last_payment_attempt_at: new Date().toISOString(),
      }),
    ]
  );
}

export async function getLatestExternalRef(orderNumber: string): Promise<string | null> {
  const row = await queryOne<{ external_ref: string }>(
    `
    SELECT external_ref FROM payment_attempts
    WHERE order_number = $1 AND gateway = 'moolre'
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [orderNumber]
  );
  if (row?.external_ref) return row.external_ref;

  const order = await queryOne<{ metadata: Record<string, unknown> | null }>(
    `SELECT metadata FROM orders WHERE order_number = $1`,
    [orderNumber]
  );
  const ref = order?.metadata?.payment_external_ref;
  return typeof ref === 'string' && ref ? ref : null;
}

export async function verifyMoolreExternalRef(externalRef: string): Promise<MoolreStatusResult> {
  const empty: MoolreStatusResult = {
    verified: false,
    amount: null,
    currency: null,
    gatewayStatus: null,
    rawCode: null,
  };

  if (!process.env.MOOLRE_API_USER || !process.env.MOOLRE_API_PUBKEY) {
    return empty;
  }

  const checkResponse = await fetchWithTimeout(
    'https://api.moolre.com/embed/status',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-USER': process.env.MOOLRE_API_USER,
        'X-API-PUBKEY': process.env.MOOLRE_API_PUBKEY,
      },
      body: JSON.stringify({ externalref: externalRef }),
    },
    15_000
  );

  const checkResult = (await checkResponse.json()) as {
    status?: number;
    code?: number;
    data?: { status?: string; amount?: string | number; currency?: string };
  };

  const gatewayStatus = checkResult.data?.status ? String(checkResult.data.status) : null;
  const verified =
    checkResult.status === 1 &&
    Boolean(checkResult.data) &&
    isSuccessfulMoolreStatus(checkResult.data?.status);

  const amount =
    checkResult.data?.amount !== undefined && checkResult.data?.amount !== null
      ? parseFloat(String(checkResult.data.amount))
      : null;

  return {
    verified,
    amount: Number.isFinite(amount as number) ? amount : null,
    currency: checkResult.data?.currency ? String(checkResult.data.currency) : null,
    gatewayStatus,
    rawCode: typeof checkResult.code === 'number' ? checkResult.code : null,
  };
}

export async function markPaymentAttemptStatus(
  externalRef: string,
  status: 'successful' | 'failed' | 'processing' | 'cancelled',
  extra?: { gatewayReference?: string; amountPaid?: number; failureReason?: string }
): Promise<void> {
  await query(
    `
    UPDATE payment_attempts SET
      status = $2,
      gateway_reference = COALESCE($3, gateway_reference),
      amount_paid = COALESCE($4, amount_paid),
      failure_reason = COALESCE($5, failure_reason),
      verified_at = CASE WHEN $2 = 'successful' THEN now() ELSE verified_at END,
      updated_at = now()
    WHERE external_ref = $1
    `,
    [
      externalRef,
      status,
      extra?.gatewayReference || null,
      extra?.amountPaid ?? null,
      extra?.failureReason || null,
    ]
  );
}

export async function recordCallbackEvent(params: {
  gateway: string;
  eventType: string;
  externalEventId?: string | null;
  reference: string;
  payloadHash: string;
  signatureOk: boolean;
  payload: unknown;
}): Promise<{ id: string; duplicate: boolean }> {
  const existing = await queryOne<{ id: string }>(
    `
    SELECT id FROM payment_callback_events
    WHERE gateway = $1 AND payload_hash = $2
    LIMIT 1
    `,
    [params.gateway, params.payloadHash]
  );
  if (existing) {
    return { id: existing.id, duplicate: true };
  }

  const inserted = await queryOne<{ id: string }>(
    `
    INSERT INTO payment_callback_events (
      gateway, event_type, external_event_id, reference, payload_hash,
      signature_ok, processing_status, payload
    ) VALUES ($1, $2, $3, $4, $5, $6, 'received', $7::jsonb)
    RETURNING id
    `,
    [
      params.gateway,
      params.eventType,
      params.externalEventId || null,
      params.reference,
      params.payloadHash,
      params.signatureOk,
      JSON.stringify(params.payload ?? {}),
    ]
  );

  return { id: inserted!.id, duplicate: false };
}
