create table if not exists public.vendor_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  vendor_name text not null,
  category text,
  product_name text not null,
  description text,
  image_url text,
  cta_text text default 'Claim My Free Sample',
  instagram text,
  facebook text,
  website text,
  order_link text,
  created_at timestamptz not null default now()
);

alter table public.vendor_pages enable row level security;

create policy "public can read vendor pages"
on public.vendor_pages
for select
using (true);

create policy "public can create vendor pages"
on public.vendor_pages
for insert
with check (true);
