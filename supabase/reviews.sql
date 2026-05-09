create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  display_name varchar(40) not null,
  rating integer not null check (rating between 1 and 5),
  review_text varchar(1000) not null check (char_length(trim(review_text)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc);

create table if not exists public.investment_projects (
  id uuid primary key default gen_random_uuid(),
  slug varchar(80) not null unique,
  name varchar(120) not null,
  summary text not null,
  total_target_lakh numeric(10,2) not null default 10.00 check (total_target_lakh > 0),
  equity_percent_open integer not null default 10 check (equity_percent_open > 0 and equity_percent_open <= 100),
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.investment_contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.investment_projects(id) on delete cascade,
  investor_name varchar(80) not null,
  amount_lakh numeric(10,2) not null check (amount_lakh > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, investor_name)
);

drop trigger if exists set_investment_contributions_updated_at on public.investment_contributions;
create trigger set_investment_contributions_updated_at
before update on public.investment_contributions
for each row
execute procedure public.set_current_timestamp_updated_at();

create index if not exists investment_projects_sort_order_idx
  on public.investment_projects (sort_order asc);

create index if not exists investment_contributions_project_id_idx
  on public.investment_contributions (project_id);

grant usage on schema public to anon;
grant select, insert on public.reviews to anon;
grant select on public.investment_projects to anon;
grant select on public.investment_contributions to anon;

alter table public.reviews enable row level security;
alter table public.investment_projects enable row level security;
alter table public.investment_contributions enable row level security;

drop policy if exists "anon can read reviews" on public.reviews;
create policy "anon can read reviews"
on public.reviews
for select
to anon
using (true);

drop policy if exists "anon can insert reviews" on public.reviews;
create policy "anon can insert reviews"
on public.reviews
for insert
to anon
with check (
  char_length(display_name) between 1 and 40
  and rating between 1 and 5
  and char_length(review_text) between 1 and 1000
);

drop policy if exists "anon can read investment projects" on public.investment_projects;
create policy "anon can read investment projects"
on public.investment_projects
for select
to anon
using (true);

drop policy if exists "anon can read investment contributions" on public.investment_contributions;
create policy "anon can read investment contributions"
on public.investment_contributions
for select
to anon
using (true);

insert into public.investment_projects (slug, name, summary, total_target_lakh, equity_percent_open, sort_order)
values
  (
    'educafe',
    'Educafe',
    'Education venture focused on structured learning, preparation, and learner support.',
    10.00,
    10,
    1
  ),
  (
    'flowpandas',
    'Flowpandas',
    'Product and engineering studio building and shipping the technical side of the portfolio.',
    10.00,
    10,
    2
  )
on conflict (slug) do update
set
  name = excluded.name,
  summary = excluded.summary,
  total_target_lakh = excluded.total_target_lakh,
  equity_percent_open = excluded.equity_percent_open,
  sort_order = excluded.sort_order;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'investment_projects'
  ) then
    alter publication supabase_realtime add table public.investment_projects;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'investment_contributions'
  ) then
    alter publication supabase_realtime add table public.investment_contributions;
  end if;
end
$$;
