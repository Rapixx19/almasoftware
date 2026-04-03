// ============================================================
// ALMA · LIB · client.ts
// ============================================================
// What this file does: Creates browser-side Supabase client
// Module: auth — see modules/auth/README.md
// Depends on: @supabase/ssr, types.ts
// Used by: React components, hooks (useAuth, etc.)
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: @supabase/ssr provides cookie-aware client for Next.js SSR.

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Environment variables validated at build time.
// NEXT_PUBLIC_ prefix required for browser access.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ─── VALIDATION ───────────────────────────────────────────
// Why: Fail fast if env vars missing — prevents cryptic runtime errors.

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  )
}

// ─── CLIENT ───────────────────────────────────────────────
// Why: Single browser client instance. Singleton pattern for efficiency.
// ⚠️ CRITICAL: Never use this client in API routes — bypasses RLS.
// Use lib/supabase/server.ts for all server-side database access.

/**
 * Creates a typed Supabase browser client for client-side operations.
 * Uses cookies for session management in Next.js.
 *
 * @returns Typed Supabase client for browser use
 * @throws Never throws — returns client or throws at module load
 * @example
 * const supabase = createClient()
 * const { data } = await supabase.from('alma_messages').select()
 */
export function createClient() {
  // Type assertion safe because we validated above at module load
  return createBrowserClient<Database>(
    SUPABASE_URL as string,
    SUPABASE_ANON_KEY as string
  )
}
