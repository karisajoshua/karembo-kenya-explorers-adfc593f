CREATE OR REPLACE FUNCTION public.bookings_set_creator()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN NEW.created_by := auth.uid(); NEW.amount_paid := 0;
  ELSE
    NEW.created_by := OLD.created_by; NEW.booking_ref := OLD.booking_ref;
    IF pg_trigger_depth() <= 1 THEN
      NEW.amount_paid := OLD.amount_paid;
      IF NEW.status NOT IN ('cancelled','completed') AND NEW.status = OLD.status THEN
        NEW.status := CASE
          WHEN NEW.amount_paid >= NEW.total_amount AND NEW.total_amount > 0 THEN 'paid'::booking_status
          WHEN NEW.amount_paid > 0 THEN 'partially_paid'::booking_status
          WHEN OLD.status IN ('paid','partially_paid') THEN 'confirmed'::booking_status
          ELSE NEW.status END;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;