-- Initial schema for Operations Backend MVP (Postgres)
-- Run once after creating the database.

-- Extensions (for UUID and crypto-safe IDs)
create extension if not exists pgcrypto;

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text,
  role text not null check (role in ('admin','driver','dispatcher')),
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  service_type text not null check (service_type in ('notary','courier','combined')),
  status text not null check (status in ('requested','assigned','in_transit','notarizing','completed','canceled')) default 'requested',
  pickup_city text,
  pickup_zip text,
  delivery_city text,
  delivery_zip text,
  urgency text not null default 'standard' check (urgency in ('standard','rush')),
  document_type text,
  notes text,
  assigned_driver uuid references users(id) on delete set null,
  -- Simple pricing fields (manual entry)
  base_fee numeric(10,2),
  rush_fee numeric(10,2),
  notary_fee numeric(10,2),
  mileage_fee numeric(10,2),
  total_fee numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_assigned_driver on orders(assigned_driver);

-- Order Events (audit timeline)
create table if not exists order_events (
  id bigserial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  event_type text not null, -- e.g., status_change, note, assign, cancel
  actor_user uuid references users(id) on delete set null,
  data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_events_order_id on order_events(order_id);
create index if not exists idx_order_events_created_at on order_events(created_at);

-- Updated_at trigger for orders
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
before update on orders
for each row
execute procedure set_updated_at();