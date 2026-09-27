CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','partially_paid','paid','completed','cancelled');
CREATE TYPE public.payment_method AS ENUM ('cash','mpesa','bank_transfer','card_manual','cheque','other');

CREATE SEQUENCE public.booking_ref_seq START 1001;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text NOT NULL UNIQUE DEFAULT ('KT-' || nextval('public.booking_ref_seq')::text),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  customer_country text,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  package_title text,
  travel_date date,
  end_date date,
  adults integer NOT NULL DEFAULT 1 CHECK (adults >= 0),
  children integer NOT NULL DEFAULT 0 CHECK (children >= 0),
  currency text NOT NULL DEFAULT 'USD',
  total_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  amount_paid numeric(12,2) NOT NULL DEFAULT 0,
  balance numeric(12,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
GRANT USAGE ON SEQUENCE public.booking_ref_seq TO authenticated, service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD',
  method public.payment_method NOT NULL,
  reference text,
  paid_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX payments_reference_unique ON public.payments (lower(btrim(reference))) WHERE reference IS NOT NULL AND btrim(reference) <> '';
CREATE INDEX payments_booking_idx ON public.payments(booking_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.payment_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL,
  booking_id uuid,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_audit TO authenticated;
GRANT ALL ON public.payment_audit TO service_role;
ALTER TABLE public.payment_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view payment audit" ON public.payment_audit FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.payments_after_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  bid uuid;
  paid numeric;
  b public.bookings%ROWTYPE;
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.payment_audit(payment_id, booking_id, action, old_data, changed_by)
    VALUES (OLD.id, OLD.booking_id, 'DELETE', to_jsonb(OLD), auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.payment_audit(payment_id, booking_id, action, old_data, new_data, changed_by)
    VALUES (NEW.id, NEW.booking_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
  ELSE
    INSERT INTO public.payment_audit(payment_id, booking_id, action, new_data, changed_by)
    VALUES (NEW.id, NEW.booking_id, 'INSERT', to_jsonb(NEW), auth.uid());
  END IF;

  FOR bid IN SELECT DISTINCT x FROM unnest(ARRAY[
      CASE WHEN TG_OP <> 'INSERT' THEN OLD.booking_id END,
      CASE WHEN TG_OP <> 'DELETE' THEN NEW.booking_id END]) x WHERE x IS NOT NULL
  LOOP
    SELECT COALESCE(SUM(amount),0) INTO paid FROM public.payments WHERE booking_id = bid;
    SELECT * INTO b FROM public.bookings WHERE id = bid;
    UPDATE public.bookings SET amount_paid = paid,
      status = CASE
        WHEN b.status IN ('cancelled','completed') THEN b.status
        WHEN paid >= b.total_amount AND b.total_amount > 0 THEN 'paid'::booking_status
        WHEN paid > 0 THEN 'partially_paid'::booking_status
        WHEN b.status IN ('paid','partially_paid') THEN 'confirmed'::booking_status
        ELSE b.status END
    WHERE id = bid;
  END LOOP;
  RETURN NULL;
END $$;

CREATE TRIGGER payments_audit_sync AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.payments_after_change();

CREATE OR REPLACE FUNCTION public.payments_set_recorder()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN NEW.recorded_by := auth.uid(); ELSE NEW.recorded_by := OLD.recorded_by; END IF;
  NEW.reference := NULLIF(btrim(NEW.reference), '');
  RETURN NEW;
END $$;
CREATE TRIGGER payments_before BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.payments_set_recorder();

CREATE OR REPLACE FUNCTION public.bookings_set_creator()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN NEW.created_by := auth.uid(); NEW.amount_paid := 0;
  ELSE NEW.created_by := OLD.created_by; NEW.amount_paid := OLD.amount_paid; NEW.booking_ref := OLD.booking_ref; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER bookings_before BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.bookings_set_creator();