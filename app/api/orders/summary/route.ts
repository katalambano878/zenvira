import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * Order summary for storefront success / pay pages.
 *
 * - Without email/session: returns minimal payment fields only (no line items / PII).
 * - With matching email or owning session: returns line items for the success page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get('order_number') || url.searchParams.get('order');
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();

  if (!ref) {
    return NextResponse.json({ error: 'order_number required' }, { status: 400 });
  }

  try {
    const order = await queryOne<{
      id: string;
      order_number: string;
      status: string;
      payment_status: string;
      total: number;
      subtotal: number;
      shipping_total: number;
      tax_total: number;
      currency: string;
      created_at: string;
      email: string;
      user_id: string | null;
      order_items: unknown;
    }>(
      `SELECT id, order_number, status::text AS status, payment_status::text AS payment_status,
              total, subtotal, shipping_total, tax_total, currency, created_at, email, user_id,
        COALESCE(
          (SELECT jsonb_agg(
            jsonb_build_object(
              'id', oi.id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total', oi.total_price
            ) ORDER BY oi.created_at
          )
           FROM order_items oi WHERE oi.order_id = o.id),
          '[]'::jsonb
        ) AS order_items
       FROM orders o
       WHERE o.order_number = $1 OR o.id::text = $1
       LIMIT 1`,
      [ref]
    );

    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let fullAccess = false;
    if (email && email === String(order.email || '').toLowerCase()) {
      fullAccess = true;
    } else {
      const auth = await verifyAuth(request);
      if (auth.authenticated && auth.user?.id && order.user_id && auth.user.id === order.user_id) {
        fullAccess = true;
      }
    }

    if (!fullAccess) {
      return NextResponse.json({
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        total: order.total,
        currency: order.currency,
        created_at: order.created_at,
      });
    }

    return NextResponse.json({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      total: order.total,
      subtotal: order.subtotal,
      shipping_total: order.shipping_total,
      tax_total: order.tax_total,
      currency: order.currency,
      created_at: order.created_at,
      email: order.email,
      order_items: order.order_items,
    });
  } catch (err: unknown) {
    console.error('[orders/summary] failed');
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 });
  }
}
