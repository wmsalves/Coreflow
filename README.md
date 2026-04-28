# Coreflow

**A personal execution system for disciplined people**

`MVP complete` · `PWA ready` · `Active development`

Coreflow brings habits, deep work, and training into one focused daily system.
It is built for people who want execution to feel structured, visible, and repeatable.

## Features

### Execution System

- Today View dashboard
- Recommended next action
- Daily execution summary
- First-time user starting state
- Mobile app-like navigation and shell

### Habits

- Daily habit tracking
- Completion and undo flow
- Streak and weekly completion signals
- Clear success and empty states

### Focus

- Pomodoro execution
- Study session planning
- Session status tracking
- Persisted focus runs
- Focus history and dashboard metrics

### Fitness

- Exercise catalog search through provider adapter
- Workout plan creation
- Workout execution with autosave and resume
- Per-exercise completion tracking
- Workout history and detail review

## Philosophy

Coreflow is built around a simple operating belief:

- Systems > motivation
- Consistency > intensity
- Clarity > complexity

The product is not designed to track everything. It is designed to keep the important work visible until it gets done.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Spring Boot
- Vercel

## Architecture

Coreflow uses Supabase as the primary data layer for app-owned data:

- habits
- study sessions and focus runs
- workout plans, sessions, logs, and history

The Spring Boot backend acts as an integration adapter for the external exercise catalog provider. The frontend consumes normalized catalog responses and keeps user-owned Fitness data in Supabase.

The frontend is organized by feature so product modules stay isolated and maintainable:

- `features/dashboard`
- `features/habits`
- `features/focus`
- `features/fitness`
- `features/landing`
- `features/auth`

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

### Backend

The backend requires Java 21.

On Windows:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

## Environment Variables

Environment files are intentionally local. Use the examples as a starting point:

- `frontend/.env.example`
- `backend/.env.example`

### Frontend

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Backend

```bash
ASCEND_API_KEY=your_key_here
ASCEND_API_HOST=edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com
ASCEND_API_BASE_URL=https://edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_JWKS_URI=
SUPABASE_JWT_SECRET=
```

## PWA and App Support

Coreflow includes a production-ready PWA foundation:

- Web App Manifest
- app icons and Apple touch icon
- service worker
- offline fallback
- standalone display support
- safe-area aware mobile shell

The product is structured to move toward PWA, Capacitor, or store-distributed app packaging without changing the core product model.

## Status

- Active development
- MVP complete
- Continuous product refinement

> Coreflow is built as a system for people who take execution seriously.
