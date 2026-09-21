-- KaliDeck database schema. Paste into the Supabase SQL editor.
-- Phase 1: accounts.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Every new auth user gets a free profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Phase 2: favorites (one row per user per tool).
create table if not exists public.favorites (
  user_id uuid not null references auth.users on delete cascade,
  tool_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, tool_slug)
);

alter table public.favorites enable row level security;

drop policy if exists "favorites_rw_own" on public.favorites;
create policy "favorites_rw_own"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Phase 3: assistant chat history and per-day usage.
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

drop policy if exists "chat_messages_rw_own" on public.chat_messages;
create policy "chat_messages_rw_own"
  on public.chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at);
