-- Pi Boost — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database.
-- URL: https://supabase.com/dashboard → SQL Editor

-- ─── Profiles table ───────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text not null default 'Pi Miner',
  wallet_address text,
  total_balance  numeric(18, 6) not null default 0,
  mining_streak  integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Row-level security: users can only read/write their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── Mining sessions table ─────────────────────────────────────────────────────
create table if not exists public.mining_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  start_time  timestamptz not null,
  end_time    timestamptz not null,
  earned      numeric(18, 6) not null,
  rate        numeric(10, 4) not null,
  circle_size integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.mining_sessions enable row level security;

create policy "Users can view own sessions"
  on public.mining_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.mining_sessions for insert
  with check (auth.uid() = user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
