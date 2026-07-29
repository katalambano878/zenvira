-- Payment attempts + callback event log for Moolre (extensible to other gateways).

CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  gateway text NOT NULL DEFAULT 'moolre',
  external_ref text NOT NULL,
  gateway_reference text,
  amount_expected numeric(12,2) NOT NULL,
  amount_paid numeric(12,2),
  currency text NOT NULL DEFAULT 'GHS',
  status text NOT NULL DEFAULT 'pending',
  initiation_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  failure_reason text,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_attempts_external_ref_unique UNIQUE (external_ref)
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_id ON public.payment_attempts (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_number ON public.payment_attempts (order_number);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON public.payment_attempts (status);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_gateway_ref ON public.payment_attempts (gateway_reference);

CREATE TABLE IF NOT EXISTS public.payment_callback_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway text NOT NULL,
  event_type text NOT NULL DEFAULT 'payment',
  external_event_id text,
  reference text NOT NULL,
  payload_hash text NOT NULL,
  signature_ok boolean NOT NULL DEFAULT false,
  processing_status text NOT NULL DEFAULT 'received',
  attempts integer NOT NULL DEFAULT 0,
  error_message text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  CONSTRAINT payment_callback_events_hash_unique UNIQUE (gateway, payload_hash)
);

CREATE INDEX IF NOT EXISTS idx_payment_callback_events_reference
  ON public.payment_callback_events (reference);

CREATE INDEX IF NOT EXISTS idx_payment_callback_events_status
  ON public.payment_callback_events (processing_status);

-- Ensure app role can use new tables when migration runs as postgres.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'store_sikahomes') THEN
    GRANT ALL PRIVILEGES ON TABLE public.payment_attempts TO store_sikahomes;
    GRANT ALL PRIVILEGES ON TABLE public.payment_callback_events TO store_sikahomes;
  END IF;
END $$;
