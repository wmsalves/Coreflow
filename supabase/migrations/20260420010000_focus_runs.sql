-- Store exact Pomodoro/focus runs. study_session_id is nullable for standalone focus mode.

create table if not exists public.focus_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  study_session_id uuid references public.study_sessions(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz not null default now(),
  duration_seconds integer not null,
  source text not null default 'pomodoro',
  created_at timestamptz not null default now(),
  constraint focus_runs_duration_seconds_check check (duration_seconds between 1 and 86400),
  constraint focus_runs_source_check check (source in ('pomodoro', 'legacy_duration'))
);

alter table public.focus_runs enable row level security;

insert into public.focus_runs (
  user_id,
  study_session_id,
  started_at,
  ended_at,
  duration_seconds,
  source
)
select
  user_id,
  id,
  coalesce(started_at, created_at, now()),
  coalesce(ended_at, started_at, created_at, now()),
  duration_minutes * 60,
  'legacy_duration'
from public.study_sessions session
where session.duration_minutes is not null
  and session.duration_minutes > 0
  and not exists (
    select 1
    from public.focus_runs run
    where run.study_session_id = session.id
      and run.source = 'legacy_duration'
  );

create index if not exists focus_runs_user_created_idx
  on public.focus_runs (user_id, created_at desc);

create index if not exists focus_runs_user_study_session_idx
  on public.focus_runs (user_id, study_session_id);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'focus_runs' and policyname = 'focus_runs_select_own'
  ) then
    create policy focus_runs_select_own
      on public.focus_runs for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'focus_runs' and policyname = 'focus_runs_insert_own'
  ) then
    create policy focus_runs_insert_own
      on public.focus_runs for insert
      with check (
        auth.uid() = user_id
        and (
          study_session_id is null
          or exists (
            select 1
            from public.study_sessions session
            where session.id = study_session_id
              and session.user_id = auth.uid()
          )
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'focus_runs' and policyname = 'focus_runs_delete_own'
  ) then
    create policy focus_runs_delete_own
      on public.focus_runs for delete
      using (auth.uid() = user_id);
  end if;
end;
$$;
