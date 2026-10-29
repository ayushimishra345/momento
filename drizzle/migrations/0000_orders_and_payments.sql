create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role public.app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null, customer_phone text not null, customer_email text not null,
  recipient_name text, address text not null, city text not null, pin text not null,
  subtotal_paise integer not null, delivery_paise integer not null, total_paise integer not null,
  currency text not null default 'INR',
  payment_method text not null check (payment_method in ('online','cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','unpaid','refunded')),
  order_status text not null default 'pending' check (order_status in ('pending','payment_failed','paid','confirmed','dispatched','delivered','cancelled')),
  test_mode boolean not null default true,
  gateway_order_id text unique, gateway_payment_id text unique,
  paid_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null, product_name text not null, unit_paise integer not null, qty integer not null check (qty between 1 and 10),
  personalisation jsonb
);
create table public.webhook_events (event_id text primary key, event_type text not null, received_at timestamptz not null default now());
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant all on public.orders, public.order_items, public.webhook_events to service_role;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.webhook_events enable row level security;
create policy "Admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins read items" on public.order_items for select to authenticated using (public.has_role(auth.uid(),'admin'));