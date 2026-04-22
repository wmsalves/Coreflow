-- Align Fitness app-owned plans/logs with the Supabase data layer.
-- The Spring API remains an exercise catalog/provider adapter only.

alter table public.exercises
  add column if not exists catalog_id text,
  add column if not exists catalog_internal_id bigint,
  add column if not exists gif_url text,
  add column if not exists image_url text,
  add column if not exists video_url text,
  add column if not exists body_part text,
  add column if not exists target text,
  add column if not exists equipment text,
  add column if not exists rest_seconds integer,
  add column if not exists notes text;

create index if not exists exercises_user_plan_order_idx
  on public.exercises (user_id, plan_id, order_index);

create table if not exists public.workout_log_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  catalog_internal_id bigint,
  name text not null,
  sets_completed integer,
  reps_completed integer,
  weight numeric(8, 2),
  order_index integer not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.workout_log_exercises enable row level security;

create index if not exists workout_log_exercises_user_log_order_idx
  on public.workout_log_exercises (user_id, workout_log_id, order_index);

drop policy if exists "workout log exercises owner access" on public.workout_log_exercises;
create policy "workout log exercises owner access" on public.workout_log_exercises
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_logs
      where workout_logs.id = workout_log_exercises.workout_log_id
        and workout_logs.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workout_logs
      where workout_logs.id = workout_log_exercises.workout_log_id
        and workout_logs.user_id = auth.uid()
    )
  );
