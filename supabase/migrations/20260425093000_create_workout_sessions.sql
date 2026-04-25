create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  workout_log_id uuid references public.workout_logs(id) on delete set null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'cancelled')),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references public.workout_sessions(id) on delete cascade,
  workout_plan_exercise_id uuid references public.exercises(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  catalog_id text,
  catalog_internal_id bigint,
  name text not null,
  gif_url text,
  image_url text,
  video_url text,
  body_part text,
  target text,
  equipment text,
  sets integer,
  reps integer,
  rest_seconds integer,
  weight numeric(8, 2),
  order_index integer not null default 0,
  notes text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.workout_sessions enable row level security;
alter table public.workout_session_exercises enable row level security;

create unique index if not exists workout_sessions_single_active_idx
  on public.workout_sessions (user_id)
  where status = 'in_progress';

create index if not exists workout_sessions_user_status_started_idx
  on public.workout_sessions (user_id, status, started_at desc);

create index if not exists workout_session_exercises_user_session_order_idx
  on public.workout_session_exercises (user_id, workout_session_id, order_index);

drop policy if exists "workout sessions owner access" on public.workout_sessions;
create policy "workout sessions owner access" on public.workout_sessions
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_plans
      where workout_plans.id = workout_sessions.workout_plan_id
        and workout_plans.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_plans
      where workout_plans.id = workout_sessions.workout_plan_id
        and workout_plans.user_id = auth.uid()
    )
  );

drop policy if exists "workout session exercises owner access" on public.workout_session_exercises;
create policy "workout session exercises owner access" on public.workout_session_exercises
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_sessions
      where workout_sessions.id = workout_session_exercises.workout_session_id
        and workout_sessions.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_sessions
      where workout_sessions.id = workout_session_exercises.workout_session_id
        and workout_sessions.user_id = auth.uid()
    )
  );
