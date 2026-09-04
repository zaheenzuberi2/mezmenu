-- ============================================================
-- MezMenu - database schema
-- Run this in the Supabase SQL editor. Safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tables
-- ------------------------------------------------------------

create table if not exists public.restaurants (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users(id) on delete cascade,

  slug              text not null unique,

  name              text not null default '',
  tagline           text not null default '',
  -- One-line deal / notice banner. Empty string = hidden.
  announcement      text not null default '',

  brand_color       text not null default '#0f172a',
  logo_url          text,

  -- Digits only, international format without '+', e.g. 923001234567.
  whatsapp_number   text not null default '',
  -- When false the menu is view-only: no cart, no order button.
  ordering_enabled  boolean not null default true,
  currency          text not null default 'PKR',

  -- The menu is live at /m/<slug> only when this is true.
  is_published      boolean not null default false,
  -- Admin bookkeeping only; billing is handled out of band for now.
  is_paid           boolean not null default false,
  plan              text not null default 'standard' check (plan in ('standard','pro')),

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists restaurants_owner_idx on public.restaurants(owner_id);

create table if not exists public.menu_categories (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants(id) on delete cascade,
  name           text not null default '',
  sort_order     int  not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);
create index if not exists menu_categories_restaurant_idx
  on public.menu_categories(restaurant_id, sort_order);

create table if not exists public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants(id) on delete cascade,
  category_id    uuid not null references public.menu_categories(id) on delete cascade,
  name           text not null default '',
  description    text not null default '',
  -- Whole rupees. Null when price_note is used instead.
  price          integer check (price is null or price >= 0),
  price_note     text not null default '',
  is_available   boolean not null default true,
  is_featured    boolean not null default false,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists menu_items_restaurant_idx
  on public.menu_items(restaurant_id, sort_order);
create index if not exists menu_items_category_idx
  on public.menu_items(category_id, sort_order);

create table if not exists public.restaurant_tables (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants(id) on delete cascade,
  label          text not null default '',
  token          text not null default encode(gen_random_bytes(6), 'hex'),
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  unique (restaurant_id, label)
);
create index if not exists restaurant_tables_restaurant_idx
  on public.restaurant_tables(restaurant_id, sort_order);

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end $fn$;

drop trigger if exists restaurants_touch_updated_at on public.restaurants;
create trigger restaurants_touch_updated_at
  before update on public.restaurants
  for each row execute function public.touch_updated_at();

drop trigger if exists menu_items_touch_updated_at on public.menu_items;
create trigger menu_items_touch_updated_at
  before update on public.menu_items
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 2. Row Level Security
-- ------------------------------------------------------------

alter table public.restaurants        enable row level security;
alter table public.menu_categories    enable row level security;
alter table public.menu_items         enable row level security;
alter table public.restaurant_tables  enable row level security;

-- Is this restaurant's menu live? security definer so a diner (anon) can
-- evaluate it without being able to read the restaurants table directly.
create or replace function public.restaurant_is_public(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.restaurants r
    where r.id = target and r.is_published
  );
$fn$;

-- Does the current user own this restaurant?
create or replace function public.owns_restaurant(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $fn$
  select exists (
    select 1 from public.restaurants r
    where r.id = target and r.owner_id = auth.uid()
  );
$fn$;

-- --- restaurants -------------------------------------------------
drop policy if exists "owner reads own restaurant"   on public.restaurants;
drop policy if exists "owner inserts own restaurant" on public.restaurants;
drop policy if exists "owner updates own restaurant" on public.restaurants;
drop policy if exists "owner deletes own restaurant" on public.restaurants;
drop policy if exists "anyone reads published menu"  on public.restaurants;

create policy "owner reads own restaurant" on public.restaurants
  for select using (auth.uid() = owner_id);
create policy "owner inserts own restaurant" on public.restaurants
  for insert with check (auth.uid() = owner_id);
create policy "owner updates own restaurant" on public.restaurants
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner deletes own restaurant" on public.restaurants
  for delete using (auth.uid() = owner_id);
create policy "anyone reads published menu" on public.restaurants
  for select using (is_published);

-- --- menu_categories ------------------------------------------
drop policy if exists "owner manages categories" on public.menu_categories;
drop policy if exists "public reads categories"  on public.menu_categories;

create policy "owner manages categories" on public.menu_categories
  for all using (public.owns_restaurant(restaurant_id))
  with check (public.owns_restaurant(restaurant_id));
create policy "public reads categories" on public.menu_categories
  for select using (is_active and public.restaurant_is_public(restaurant_id));

-- --- menu_items ---------------------------------------------
-- Unavailable items are still returned to diners (shown greyed out as
-- "sold out"), so the read policy does not filter on is_available.
drop policy if exists "owner manages items" on public.menu_items;
drop policy if exists "public reads items"  on public.menu_items;

create policy "owner manages items" on public.menu_items
  for all using (public.owns_restaurant(restaurant_id))
  with check (public.owns_restaurant(restaurant_id));
create policy "public reads items" on public.menu_items
  for select using (public.restaurant_is_public(restaurant_id));

-- --- restaurant_tables -------------------------------------
-- Owner only. The diner page reads the table label from the QR URL, it
-- never needs to query this table.
drop policy if exists "owner manages tables" on public.restaurant_tables;

create policy "owner manages tables" on public.restaurant_tables
  for all using (public.owns_restaurant(restaurant_id))
  with check (public.owns_restaurant(restaurant_id));

-- ------------------------------------------------------------
-- 3. Storage: restaurant logos (optional, one small image per restaurant)
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('restaurant-logos', 'restaurant-logos', true)
on conflict (id) do update set public = true;

-- Files live at <restaurant_id>/<filename>, so the first path segment
-- decides who may write. Reads are public because the bucket is public.
drop policy if exists "public reads restaurant logos"  on storage.objects;
drop policy if exists "owner uploads restaurant logos" on storage.objects;
drop policy if exists "owner updates restaurant logos" on storage.objects;
drop policy if exists "owner deletes restaurant logos" on storage.objects;

create policy "public reads restaurant logos" on storage.objects
  for select using (bucket_id = 'restaurant-logos');

create policy "owner uploads restaurant logos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'restaurant-logos'
    and public.owns_restaurant(((storage.foldername(name))[1])::uuid)
  );

create policy "owner updates restaurant logos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'restaurant-logos'
    and public.owns_restaurant(((storage.foldername(name))[1])::uuid)
  );

create policy "owner deletes restaurant logos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'restaurant-logos'
    and public.owns_restaurant(((storage.foldername(name))[1])::uuid)
  );
