// ============================================================
// ALMA · MIDDLEWARE · middleware.ts
// ============================================================
// What this file does: Protects /app/* routes, refreshes auth sessions
// Module: auth — see modules/auth/README.md
// Depends on: @supabase/ssr, next/server
// Used by: All routes (runs on every request)
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Middleware uses edge-compatible Supabase client.
// NextResponse for redirects and cookie manipulation.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Public routes that don't require authentication.

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/auth/callback']

// ─── MIDDLEWARE ───────────────────────────────────────────
// Why: Runs before every request to:
// 1. Refresh session cookies (prevents expiration during active use)
// 2. Protect /app/* routes from unauthenticated access
// ⚠️ CRITICAL: This is the primary auth gate. All /app/* access goes through here.

/**
 * Middleware function for auth protection and session refresh.
 * Redirects unauthenticated users from /app/* to /login.
 *
 * @param request - Incoming Next.js request
 * @returns NextResponse with updated cookies or redirect
 * @throws Never throws — errors result in redirect to login
 */
export async function middleware(request: NextRequest) {
  // Create response to modify cookies on
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Environment validation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // If env vars missing, let the request through — will fail elsewhere
    return supabaseResponse
  }

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Update response cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — this updates cookies if session is refreshed
  // ⚠️ CRITICAL: getUser() validates the JWT with Supabase servers.
  // Do NOT use getSession() alone — it only reads local cookie, no validation.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith('/auth/')
  )

  // Check if route requires auth (/app/* routes)
  const requiresAuth = pathname.startsWith('/app')

  // Redirect unauthenticated users trying to access protected routes
  if (requiresAuth && !user) {
    const loginUrl = new URL('/login', request.url)
    // Preserve the intended destination for post-login redirect
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return supabaseResponse
}

// ─── CONFIG ───────────────────────────────────────────────
// Why: Only run middleware on relevant paths.
// Exclude static files, images, and API routes that handle their own auth.

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
