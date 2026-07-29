import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { fetchWithTimeout } from '@/lib/http/fetch-timeout';
import { recordPaymentAttempt } from '@/lib/payments/moolre';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { getAppUrl, getServerAdminEmail } from '@/lib/site-defaults';

type OrderRow = {
  id: string;
  order_number: string;
  total: number;
  email: string;
  payment_status: string;
};

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`payment:${clientId}`, RATE_LIMITS.payment);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { orderId, customerEmail } = body;

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid orderId' }, { status: 400 });
    }

    if (!process.env.MOOLRE_API_USER || !process.env.MOOLRE_API_PUBKEY || !process.env.MOOLRE_ACCOUNT_NUMBER) {
      console.error('Missing Moolre credentials');
      return NextResponse.json({ success: false, message: 'Payment gateway configuration error' }, { status: 500 });
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const order = await queryOne<OrderRow>(
      isUUID
        ? `SELECT id, order_number, total, email, payment_status::text AS payment_status
           FROM orders WHERE id = $1::uuid OR order_number = $1 LIMIT 1`
        : `SELECT id, order_number, total, email, payment_status::text AS payment_status
           FROM orders WHERE order_number = $1 LIMIT 1`,
      [orderId]
    );

    if (!order) {
      console.error('[Payment] Order not found');
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ success: false, message: 'Order is already paid' }, { status: 400 });
    }

    const amount = Number(order.total);
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid order amount' }, { status: 400 });
    }

    const orderRef = order.order_number || orderId;
    const requestUrl = new URL(req.url);
    const baseUrl = (getAppUrl() || requestUrl.origin).replace(/\/+$/, '');
    const uniqueRef = `${orderRef}-R${Date.now()}`;

    const payload = {
      type: 1,
      amount: amount.toString(),
      email: process.env.MOOLRE_MERCHANT_EMAIL || getServerAdminEmail(),
      externalref: uniqueRef,
      callback: `${baseUrl}/api/payment/moolre/callback`,
      redirect: `${baseUrl}/order-success?order=${orderRef}&payment_success=true`,
      reusable: '0',
      currency: 'GHS',
      accountnumber: process.env.MOOLRE_ACCOUNT_NUMBER,
      metadata: {
        customer_email: customerEmail || order.email,
        original_order_number: orderRef,
      },
    };

    const response = await fetchWithTimeout(
      'https://api.moolre.com/embed/link',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-USER': process.env.MOOLRE_API_USER,
          'X-API-PUBKEY': process.env.MOOLRE_API_PUBKEY,
        },
        body: JSON.stringify(payload),
      },
      20_000
    );

    const result = await response.json();

    if (result.status === 1 && result.data?.authorization_url) {
      try {
        await recordPaymentAttempt({
          orderId: order.id,
          orderNumber: orderRef,
          externalRef: uniqueRef,
          amount,
          currency: 'GHS',
          gatewayReference: result.data.reference ? String(result.data.reference) : null,
          rawInit: {
            amount,
            currency: 'GHS',
            externalref: uniqueRef,
            callback: payload.callback,
          },
        });
      } catch (recordErr: unknown) {
        console.error('[Payment] Failed to record payment attempt:', recordErr);
      }

      return NextResponse.json({
        success: true,
        url: result.data.authorization_url,
        reference: result.data.reference,
        externalRef: uniqueRef,
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Failed to generate payment link' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
