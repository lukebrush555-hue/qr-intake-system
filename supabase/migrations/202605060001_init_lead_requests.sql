create extension if not exists pgcrypto;

create table if not exists public.lead_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_type text not null default 'generic',
  template_id text not null default 'hero-form',
  source_id text,
  qr_id text,
  name text,
  phone text,
  email text,
  business_name text,
  message text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.lead_requests enable row level security;

revoke all on table public.lead_requests from anon;
revoke all on table public.lead_requests from authenticated;

grant usage on schema public to anon;
grant insert on table public.lead_requests to anon;
grant all on table public.lead_requests to service_role;

drop policy if exists "anon can insert lead requests" on public.lead_requests;
create policy "anon can insert lead requests"
on public.lead_requests
for insert
to anon
with check (true);
