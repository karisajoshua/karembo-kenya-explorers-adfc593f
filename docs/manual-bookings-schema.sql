-- Apply to Karembo Supabase only after reviewing existing project configuration.
create table if not exists public.manual_bookings (
 id uuid primary key default gen_random_uuid(),
 customer_name text not null,
 customer_email text,
 customer_phone text,
 package_name text not null,
 travel_date date,
 guests integer not null default 1 check (guests > 0),
 currency text not null default 'KES' check (currency = 'KES'),
 total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
 status text not null default 'pending' check (status in ('pending','awaiting_payment','partially_paid','paid','confirmed','cancelled')),
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.manual_payment_records (
 id uuid primary key default gen_random_uuid(),
 booking_id uuid not null references public.manual_bookings(id) on delete restrict,
 amount numeric(12,2) not null check (amount > 0),
 method text not null check (method in ('mpesa','bank_transfer','cash','other')),
 reference text not null,
 received_at timestamptz not null default now(),
 recorded_by uuid not null default auth.uid(),
 created_at timestamptz not null default now(),
 unique(method, reference)
);
create index if not exists manual_payment_booking_idx on public.manual_payment_records(booking_id);
alter table public.manual_bookings enable row level security;
alter table public.manual_payment_records enable row level security;
create policy "Admins manage bookings" on public.manual_bookings for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins read payments" on public.manual_payment_records for select to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "Admins record payments" on public.manual_payment_records for insert to authenticated
with check (public.has_role(auth.uid(), 'admin') and recorded_by = auth.uid());
-- Payment records are immutable: corrections require a documented reversal workflow.
