import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { sendOrderConfirmation } from '@/lib/notifications';
import {
  markPaymentAttemptStatus,
  recordCallbackEvent,
  stripPaymentAttemptSuffix,
} from '@/lib/payments/moolre';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

type OrderJson = Record<string, unknown> & {
  id?: string;
  order_number?: string;
  email?: string;
  total?: number;
  payment_status?: string;
};

async function markOrderPaid(orderRef: string, moolreRef: string): Promise<OrderJson | null> {
  const row = await queryOne<{ result: OrderJson }>(
    `SELECT mark_order_paid($1, $2) AS result`,
    [orderRef, moolreRef]
  );
  return row?.result ?? null;
}

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`callback:${clientId}`, RATE_LIMITS.callback);

    if (!rateLimitResult.success) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    let body: Record<string, unknown> = {};
    const contentType = req.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        body = await req.json();
      } else if (contentType.includes('form')) {
        const formData = await req.formData();
        body = Object.fromEntries(formData.entries()) as Record<string, unknown>;
      } else {
        const rawText = await req.text();
        try {
          body = JSON.parse(rawText);
        } catch {
          body = Object.fromEntries(new URLSearchParams(rawText).entries()) as Record<string, unknown>;
        }
      }
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid Request Body' }, { status: 400 });
    }

    const expectedSecret = process.env.MOOLRE_CALLBACK_SECRET;
    const signatureOk = Boolean(expectedSecret) && body.secret === expectedSecret;
    if (expectedSecret && !signatureOk) {
      return NextResponse.json({ success: false, message: 'Invalid callback signature' }, { status: 403 });
    }

    const data = (body.data || {}) as Record<string, unknown>;
    const rawExternalRef =
      data.externalref ||
      data.external_reference ||
      data.orderRef ||
      body.externalref ||
      body.orderRef ||
      body.external_reference;

    const rawRefStr = rawExternalRef ? String(rawExternalRef) : '';
    const metadata = (data.metadata || body.metadata || {}) as Record<string, unknown>;
    const merchantOrderRef = rawRefStr
      ? stripPaymentAttemptSuffix(rawRefStr)
      : String(metadata.original_order_number || '');

    const moolreReference = String(
      data.transactionid || data.thirdpartyref || body.reference || 'callback'
    );

    const apiStatus = body.status;
    const txStatus = data.txtstatus;
    const messageStr = String(body.message || '').toLowerCase();

    if (!merchantOrderRef) {
      return NextResponse.json({ success: false, message: 'Missing order reference' }, { status: 400 });
    }

    const payloadHash = createHash('sha256')
      .update(JSON.stringify({ merchantOrderRef, moolreReference, apiStatus, txStatus, amount: data.amount }))
      .digest('hex');

    let eventId: string | null = null;
    try {
      const recorded = await recordCallbackEvent({
        gateway: 'moolre',
        eventType: 'payment_callback',
        externalEventId: moolreReference,
        reference: merchantOrderRef,
        payloadHash,
        signatureOk: expectedSecret ? signatureOk : false,
        payload: {
          merchantOrderRef,
          moolreReference,
          apiStatus,
          txStatus,
          amount: data.amount ?? body.amount ?? null,
        },
      });
      eventId = recorded.id;
      if (recorded.duplicate) {
        return NextResponse.json({ success: true, message: 'Duplicate callback ignored' });
      }
    } catch (eventErr: unknown) {
      console.error('[Callback] Event record failed');
    }

    const apiOk = apiStatus === 1 || apiStatus === '1';
    const txOk = txStatus === 1 || txStatus === '1';
    const isSuccess = (apiOk || txOk) && !messageStr.includes('fail') && !messageStr.includes('error');

    if (isSuccess) {
      const existingOrder = await queryOne<{ id: string; payment_status: string; total: number }>(
        `SELECT id, payment_status::text AS payment_status, total FROM orders WHERE order_number = $1`,
        [merchantOrderRef]
      );

      if (!existingOrder) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }

      if (existingOrder.payment_status === 'paid') {
        if (rawRefStr) {
          try {
            await markPaymentAttemptStatus(rawRefStr, 'successful', {
              gatewayReference: moolreReference,
              amountPaid: Number(existingOrder.total),
            });
          } catch {
            /* best-effort */
          }
        }
        return NextResponse.json({ success: true, message: 'Order already processed' });
      }

      const callbackAmount = data.amount
        ? parseFloat(String(data.amount))
        : body.amount
          ? parseFloat(String(body.amount))
          : null;
      if (callbackAmount !== null) {
        const expectedAmount = Number(existingOrder.total);
        if (Math.abs(callbackAmount - expectedAmount) > 0.01) {
          return NextResponse.json(
            { success: false, message: 'Payment amount does not match order total' },
            { status: 400 }
          );
        }
      }

      const orderJson = await markOrderPaid(merchantOrderRef, moolreReference);
      if (!orderJson?.id) {
        return NextResponse.json({ success: false, message: 'Database update failed' }, { status: 500 });
      }

      if (rawRefStr) {
        try {
          await markPaymentAttemptStatus(rawRefStr, 'successful', {
            gatewayReference: moolreReference,
            amountPaid: callbackAmount ?? Number(existingOrder.total),
          });
        } catch {
          /* best-effort */
        }
      }

      if (eventId) {
        try {
          await query(
            `UPDATE payment_callback_events
             SET processing_status = 'processed', processed_at = now(), attempts = attempts + 1
             WHERE id = $1::uuid`,
            [eventId]
          );
        } catch {
          /* best-effort */
        }
      }

      if (orderJson.email) {
        try {
          await query(`SELECT update_customer_stats($1, $2)`, [
            String(orderJson.email),
            Number(orderJson.total),
          ]);
        } catch {
          console.error('[Callback] Customer stats failed');
        }
      }

      try {
        await sendOrderConfirmation(orderJson);
      } catch {
        console.error('[Callback] Notification failed');
      }

      return NextResponse.json({ success: true, message: 'Payment verified and Order Updated' });
    }

    await query(
      `UPDATE orders SET payment_status = 'failed'::payment_status,
       metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb
       WHERE order_number = $1 AND payment_status <> 'paid'::payment_status`,
      [
        merchantOrderRef,
        JSON.stringify({
          moolre_reference: moolreReference,
          failure_reason: body.message || 'Payment failed',
        }),
      ]
    );

    if (rawRefStr) {
      try {
        await markPaymentAttemptStatus(rawRefStr, 'failed', {
          gatewayReference: moolreReference,
          failureReason: String(body.message || 'Payment failed'),
        });
      } catch {
        /* best-effort */
      }
    }

    return NextResponse.json({ success: false, message: 'Payment not successful' });
  } catch (error: unknown) {
    console.error('[Callback] Critical Error');
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Moolre callback endpoint ready',
    timestamp: new Date().toISOString(),
  });
}
