-- Run this in Supabase SQL Editor to create the hero_stats table for HeroStatsReel.
-- Then add rows via Table Editor or API (id, title, subtitle, highlight, suffix, description, image, sort_order).

create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  highlight text not null,
  suffix text default '',
  description text not null,
  image text not null,
  sort_order int not null default 0
);

alter table public.hero_stats enable row level security;

create policy "Allow public read"
  on public.hero_stats for select
  using (true);

-- Admin: allow authenticated users to insert, update, delete
create policy "Allow authenticated insert"
  on public.hero_stats for insert
  with check (auth.role() = 'authenticated');
create policy "Allow authenticated update"
  on public.hero_stats for update
  using (auth.role() = 'authenticated');
create policy "Allow authenticated delete"
  on public.hero_stats for delete
  using (auth.role() = 'authenticated');
