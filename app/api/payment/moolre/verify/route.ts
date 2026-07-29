import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { sendOrderConfirmation } from '@/lib/notifications';
import {
  getLatestExternalRef,
  markPaymentAttemptStatus,
  verifyMoolreExternalRef,
} from '@/lib/payments/moolre';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

type OrderRow = {
  id: string;
  order_number: string;
  payment_status: string;
  status: string;
  total: number;
  email: string;
  phone: string | null;
  shipping_address: unknown;
  metadata: Record<string, unknown> | null;
};

type OrderJson = Record<string, unknown>;

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`verify:${clientId}`, RATE_LIMITS.payment);

    if (!rateLimitResult.success) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const { orderNumber } = await req.json();

    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid orderNumber' }, { status: 400 });
    }

    if (!/^ORD-\d+-\d+$/.test(orderNumber)) {
      return NextResponse.json({ success: false, message: 'Invalid order number format' }, { status: 400 });
    }

    const order = await queryOne<OrderRow>(
      `SELECT id, order_number, payment_status::text AS payment_status, status::text AS status,
              total, email, phone, shipping_address, metadata
       FROM orders WHERE order_number = $1`,
      [orderNumber]
    );

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        status: order.status,
        payment_status: order.payment_status,
        message: 'Order already paid',
      });
    }

    const meta = order.metadata || {};
    if (meta.payment_method && meta.payment_method !== 'moolre') {
      return NextResponse.json(
        {
          success: false,
          message: 'This order does not use Moolre payment',
        },
        { status: 400 }
      );
    }

    if (!process.env.MOOLRE_API_USER || !process.env.MOOLRE_API_PUBKEY) {
      return NextResponse.json(
        {
          success: false,
          status: order.status,
          payment_status: order.payment_status,
          message: 'Payment verification unavailable',
        },
        { status: 503 }
      );
    }

    const storedRef = await getLatestExternalRef(orderNumber);
    const refsToTry = Array.from(new Set([storedRef, orderNumber].filter(Boolean) as string[]));

    let moolreApiVerified = false;
    let matchedRef: string | null = null;
    let paidAmount: number | null = null;

    for (const externalRef of refsToTry) {
      try {
        const check = await verifyMoolreExternalRef(externalRef);
        if (!check.verified) continue;

        if (check.amount !== null && Math.abs(check.amount - Number(order.total)) > 0.01) {
          console.warn('[Verify] Amount mismatch for', orderNumber);
          continue;
        }

        moolreApiVerified = true;
        matchedRef = externalRef;
        paidAmount = check.amount;
        break;
      } catch (moolreError: unknown) {
        console.warn('[Verify] Moolre API check failed');
      }
    }

    if (!moolreApiVerified || !matchedRef) {
      return NextResponse.json({
        success: false,
        status: order.status,
        payment_status: order.payment_status,
        message: 'Payment not yet confirmed by payment provider',
      });
    }

    const paidRow = await queryOne<{ result: OrderJson }>(
      `SELECT mark_order_paid($1, $2) AS result`,
      [orderNumber, `moolre-api-verify:${matchedRef}`]
    );
    const orderJson = paidRow?.result;

    if (!orderJson) {
      return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
    }

    try {
      await markPaymentAttemptStatus(matchedRef, 'successful', {
        amountPaid: paidAmount ?? Number(order.total),
        gatewayReference: `verify:${matchedRef}`,
      });
    } catch {
      /* best-effort */
    }

    if (orderJson.email) {
      try {
        await query(`SELECT update_customer_stats($1, $2)`, [
          String(orderJson.email),
          Number(orderJson.total),
        ]);
      } catch (statsError: unknown) {
        console.error('[Verify] Customer stats failed');
      }
    }

    try {
      await sendOrderConfirmation(orderJson);
    } catch (notifyError: unknown) {
      console.error('[Verify] Notification failed');
    }

    return NextResponse.json({
      success: true,
      status: 'processing',
      payment_status: 'paid',
      message: 'Payment verified and order updated',
    });
  } catch (error: unknown) {
    console.error('[Verify] Error');
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
