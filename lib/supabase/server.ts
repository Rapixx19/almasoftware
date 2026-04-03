// ============================================================
// ALMA · LIB · server.ts
// ============================================================
// What this file does: Creates server-side Supabase client with cookie handling
// Module: auth — see modules/auth/README.md
// Depends on: @supabase/ssr, next/headers, types.ts
// Used by: API routes, Server Components, middleware
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client requires cookie access for session management.
// Using @supabase/ssr for proper Next.js App Router integration.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Environment variables for Supabase connection.
// Server-side can access non-NEXT_PUBLIC_ vars if needed.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ─── VALIDATION ───────────────────────────────────────────
// Why: Fail fast if env vars missing.

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  )
}

// ─── SERVER CLIENT ────────────────────────────────────────
// Why: Server client respects RLS policies via session cookies.
// ⚠️ CRITICAL: Use this for ALL server-side DB access.
// Browser client in API routes would bypass RLS entirely.

/**
 * Creates a typed Supabase server client for server-side operations.
 * Reads session from cookies, respects RLS policies.
 *
 * @returns Promise resolving to typed Supabase client
 * @throws Never throws — errors handled internally
 * @example
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Type assertion safe because we validated above at module load
  return createServerClient<Database>(
    SUPABASE_URL as string,
    SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          // We need to try/catch because this might be called from
          // a Server Component where cookies cannot be set
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Cast options to satisfy Next.js cookies API
              cookieStore.set(name, value, options as Record<string, unknown>)
            })
          } catch {
            // Called from Server Component — ignore
            // Middleware will handle cookie refresh
          }
        },
      },
    }
  )
}
