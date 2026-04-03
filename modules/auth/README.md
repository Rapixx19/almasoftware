# Auth Module

## Purpose
Authentication and user session management via Supabase Auth.

## Exports
- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server Supabase client
- `hooks/useAuth.ts` — Auth state hook

## Dependencies
- `@supabase/supabase-js`
- `@supabase/ssr`

## Used By
- All protected routes
- API routes requiring authentication

## Zone
YELLOW — Review required.
