# Auth Module

## Purpose
Authentication and user session management via Supabase Auth.

## Exports
- `lib/supabase/client.ts` — Browser Supabase client (YELLOW zone)
- `lib/supabase/server.ts` — Server Supabase client (RED zone)
- `lib/supabase/types.ts` — Generated database types (GREEN zone)
- `hooks/useAuth.ts` — Auth state hook (YELLOW zone)
- `middleware.ts` — Auth protection middleware (RED zone)

## Pages
- `app/(auth)/login/page.tsx` — Email/password + Google OAuth login
- `app/(auth)/signup/page.tsx` — Invite-gated signup flow
- `app/auth/callback/route.ts` — OAuth callback handler

## API Routes
- `app/api/auth/validate-invite/route.ts` — Invite code validation

## Database Tables
- `users_profile` — User profile data (auto-created on signup)
- `invite_codes` — Gated signup invite codes

## Dependencies
- `@supabase/supabase-js`
- `@supabase/ssr`
- `zod` (for API validation)

## Used By
- All protected routes (`/app/*`)
- API routes requiring authentication

## Security Notes
- ⚠️ **Never use browser client in API routes** — bypasses RLS
- ⚠️ **user_id always from session** — never from request body
- Middleware validates JWT with Supabase servers on every request
- All tables have RLS policies

## Test Invite Code
For development: `ALMA2026`

## Zone
YELLOW — Review required.

## Last Checkpoint
PHASE-01
