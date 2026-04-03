// ============================================================
// ALMA · APP · auth/callback/route.ts
// ============================================================
// What this file does: Handles OAuth callback, exchanges code for session
// Module: auth — see modules/auth/README.md
// Depends on: lib/supabase/server.ts
// Used by: OAuth providers (Google) after successful auth
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for session management, redirect for navigation.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── HANDLER ──────────────────────────────────────────────
// Why: GET handler receives OAuth callback with auth code.
// Exchanges code for session, then redirects to app.

/**
 * OAuth callback handler. Exchanges auth code for session.
 * Redirects to /app on success, /login with error on failure.
 *
 * @param request - Incoming request with auth code in URL params
 * @returns Redirect response to /app or /login
 * @throws Never throws — errors result in redirect to login
 */
export async function GET(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle OAuth error
  if (error) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  // Exchange code for session
  if (code) {
    try {
      const supabase = await createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        const loginUrl = new URL('/login', origin)
        loginUrl.searchParams.set('error', 'Failed to complete sign in')
        return NextResponse.redirect(loginUrl)
      }

      // Success — redirect to app
      return NextResponse.redirect(new URL('/app', origin))
    } catch {
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('error', 'Authentication failed')
      return NextResponse.redirect(loginUrl)
    }
  }

  // No code provided — redirect to login
  return NextResponse.redirect(new URL('/login', origin))
}
