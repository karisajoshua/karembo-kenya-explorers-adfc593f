ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS price_private numeric,
  ADD COLUMN IF NOT EXISTS min_guests integer;