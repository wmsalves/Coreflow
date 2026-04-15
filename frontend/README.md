# Coreflow Frontend

Next.js App Router frontend for Coreflow.

## Local Development

1. Copy `.env.example` to `.env.local`.
2. Configure Supabase credentials and `NEXT_PUBLIC_API_URL`.
3. Run the frontend:

```bash
npm run dev
```

The frontend keeps Supabase auth and the current habits module working while introducing `src/lib/api` as the transition layer for the future Java backend.

## Frontend Responsibilities

- Route rendering and dashboard UI
- Supabase auth integration
- Feature modules such as habits
- API client wrappers for the external backend migration

## Deployment

The frontend targets Vercel and expects the backend API base URL to be available through `NEXT_PUBLIC_API_URL`.
