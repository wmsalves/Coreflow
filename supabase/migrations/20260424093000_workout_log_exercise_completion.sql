alter table public.workout_log_exercises
  add column if not exists completed boolean not null default false,
  add column if not exists completed_at timestamptz;

create index if not exists workout_log_exercises_user_log_completed_idx
  on public.workout_log_exercises (user_id, workout_log_id, completed);
