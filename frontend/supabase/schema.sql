create extension if not exists pgcrypto;

create type public.subscription_plan as enum ('free', 'pro');
create type public.subscription_status as enum ('inactive', 'trialing', 'active', 'past_due', 'canceled');

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan public.subscription_plan not null default 'free',
  status public.subscription_status not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  frequency_per_week integer not null default 7 check (frequency_per_week between 1 and 7),
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, habit_id, completed_on)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  notes text,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  duration_minutes integer,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sets integer,
  reps integer,
  weight numeric(8, 2),
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.workout_plans(id) on delete set null,
  performed_at timestamptz not null default timezone('utc', now()),
  duration_minutes integer,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_handle_updated_at on public.profiles;
create trigger profiles_handle_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists subscriptions_handle_updated_at on public.subscriptions;
create trigger subscriptions_handle_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

drop trigger if exists habits_handle_updated_at on public.habits;
create trigger habits_handle_updated_at
  before update on public.habits
  for each row execute procedure public.handle_updated_at();

drop trigger if exists workout_plans_handle_updated_at on public.workout_plans;
create trigger workout_plans_handle_updated_at
  before update on public.workout_plans
  for each row execute procedure public.handle_updated_at();

drop trigger if exists exercises_handle_updated_at on public.exercises;
create trigger exercises_handle_updated_at
  before update on public.exercises
  for each row execute procedure public.handle_updated_at();

drop trigger if exists workout_logs_handle_updated_at on public.workout_logs;
create trigger workout_logs_handle_updated_at
  before update on public.workout_logs
  for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.study_sessions enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_logs enable row level security;

create policy "profiles owner access" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "subscriptions owner access" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habits owner access" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "habit logs owner access" on public.habit_logs;
create policy "habit logs owner access" on public.habit_logs
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.habits
      where habits.id = habit_logs.habit_id
        and habits.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.habits
      where habits.id = habit_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "study sessions owner access" on public.study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout plans owner access" on public.workout_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "exercises owner access" on public.exercises;
create policy "exercises owner access" on public.exercises
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_plans
      where workout_plans.id = exercises.plan_id
        and workout_plans.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_plans
      where workout_plans.id = exercises.plan_id
        and workout_plans.user_id = auth.uid()
    )
  );

drop policy if exists "workout logs owner access" on public.workout_logs;
create policy "workout logs owner access" on public.workout_logs
  for all
  using (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (
        select 1
        from public.workout_plans
        where workout_plans.id = workout_logs.plan_id
          and workout_plans.user_id = auth.uid()
      )
    )
  )
  with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (
        select 1
        from public.workout_plans
        where workout_plans.id = workout_logs.plan_id
          and workout_plans.user_id = auth.uid()
      )
    )
  );
