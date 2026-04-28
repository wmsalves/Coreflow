alter table public.focus_runs
  add column if not exists cycles_completed integer not null default 0,
  add column if not exists status text not null default 'completed';

alter table public.focus_runs
  drop constraint if exists focus_runs_cycles_completed_check;

alter table public.focus_runs
  add constraint focus_runs_cycles_completed_check
    check (cycles_completed >= 0);

alter table public.focus_runs
  drop constraint if exists focus_runs_status_check;

alter table public.focus_runs
  add constraint focus_runs_status_check
    check (status in ('completed', 'canceled'));

create index if not exists focus_runs_user_ended_at_idx
  on public.focus_runs (user_id, ended_at desc);
