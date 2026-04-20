-- Promote Focus planner metadata from study_sessions.notes JSON into typed columns.
-- notes remains available for freeform session description only.

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  notes text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer,
  created_at timestamptz not null default now()
);

alter table public.study_sessions enable row level security;

create or replace function public.coreflow_try_jsonb(input_text text)
returns jsonb
language plpgsql
immutable
as $$
begin
  if input_text is null or btrim(input_text) = '' then
    return '{}'::jsonb;
  end if;

  return input_text::jsonb;
exception
  when others then
    return '{}'::jsonb;
end;
$$;

alter table public.study_sessions
  add column if not exists title text,
  add column if not exists status text not null default 'pending',
  add column if not exists difficulty text not null default 'medium',
  add column if not exists importance text not null default 'medium',
  add column if not exists estimated_minutes integer not null default 45,
  add column if not exists due_date date;

with parsed as (
  select
    id,
    public.coreflow_try_jsonb(notes) as metadata
  from public.study_sessions
)
update public.study_sessions as session
set
  title = coalesce(nullif(parsed.metadata->>'title', ''), nullif(session.subject, ''), 'Study session'),
  status = case
    when session.ended_at is not null then 'completed'
    when parsed.metadata->>'status' in ('pending', 'in_progress', 'completed', 'canceled', 'archived')
      then parsed.metadata->>'status'
    else coalesce(nullif(session.status, ''), 'pending')
  end,
  difficulty = case
    when parsed.metadata->>'difficulty' in ('low', 'medium', 'high') then parsed.metadata->>'difficulty'
    when session.difficulty in ('low', 'medium', 'high') then session.difficulty
    else 'medium'
  end,
  importance = case
    when parsed.metadata->>'importance' in ('low', 'medium', 'high') then parsed.metadata->>'importance'
    when session.importance in ('low', 'medium', 'high') then session.importance
    else 'medium'
  end,
  estimated_minutes = case
    when parsed.metadata->>'estimatedMinutes' ~ '^[0-9]+$'
      then greatest(5, least(600, (parsed.metadata->>'estimatedMinutes')::integer))
    when session.estimated_minutes is not null
      then greatest(5, least(600, session.estimated_minutes))
    when session.duration_minutes is not null and session.duration_minutes > 0
      then greatest(5, least(600, session.duration_minutes))
    else 45
  end,
  due_date = case
    when parsed.metadata->>'dueDate' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      then (parsed.metadata->>'dueDate')::date
    else coalesce(session.due_date, session.started_at::date, current_date)
  end,
  notes = case
    when parsed.metadata <> '{}'::jsonb then nullif(parsed.metadata->>'description', '')
    else session.notes
  end
from parsed
where session.id = parsed.id;

update public.study_sessions
set
  title = coalesce(nullif(title, ''), nullif(subject, ''), 'Study session'),
  due_date = coalesce(due_date, started_at::date, current_date);

alter table public.study_sessions
  alter column title set not null,
  alter column due_date set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'study_sessions_status_check'
  ) then
    alter table public.study_sessions
      add constraint study_sessions_status_check
      check (status in ('pending', 'in_progress', 'completed', 'canceled', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'study_sessions_difficulty_check'
  ) then
    alter table public.study_sessions
      add constraint study_sessions_difficulty_check
      check (difficulty in ('low', 'medium', 'high'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'study_sessions_importance_check'
  ) then
    alter table public.study_sessions
      add constraint study_sessions_importance_check
      check (importance in ('low', 'medium', 'high'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'study_sessions_estimated_minutes_check'
  ) then
    alter table public.study_sessions
      add constraint study_sessions_estimated_minutes_check
      check (estimated_minutes between 5 and 600);
  end if;
end;
$$;

create index if not exists study_sessions_user_status_due_idx
  on public.study_sessions (user_id, status, due_date);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'study_sessions' and policyname = 'study_sessions_select_own'
  ) then
    create policy study_sessions_select_own
      on public.study_sessions for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'study_sessions' and policyname = 'study_sessions_insert_own'
  ) then
    create policy study_sessions_insert_own
      on public.study_sessions for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'study_sessions' and policyname = 'study_sessions_update_own'
  ) then
    create policy study_sessions_update_own
      on public.study_sessions for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'study_sessions' and policyname = 'study_sessions_delete_own'
  ) then
    create policy study_sessions_delete_own
      on public.study_sessions for delete
      using (auth.uid() = user_id);
  end if;
end;
$$;

drop function public.coreflow_try_jsonb(text);
