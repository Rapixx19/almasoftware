// ============================================================
// ALMA · HOOKS · useAuth.ts
// ============================================================
// What this file does: Provides auth state and actions for React components
// Module: auth — see modules/auth/README.md
// Depends on: lib/supabase/client.ts, @supabase/supabase-js
// Used by: Login page, Signup page, protected components
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Browser client for auth operations, React hooks for state.

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthError } from '@supabase/supabase-js'

// ─── TYPES ────────────────────────────────────────────────
// Why: Explicit interface for hook consumers.

interface UseAuthReturn {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: AuthError | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, inviteCode: string) => Promise<void>
}

// ─── HOOK ─────────────────────────────────────────────────
// Why: Centralizes auth logic for consistent auth state across app.

/**
 * Hook providing auth state and actions for client components.
 * Subscribes to auth changes for real-time session updates.
 *
 * @returns Auth state and action functions
 * @throws Never throws — errors captured in error state
 * @example
 * const { user, isLoading, login, logout } = useAuth()
 * if (isLoading) return <Skeleton />
 * if (!user) return <LoginPrompt />
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Initialize Supabase client once
  const supabase = createClient()

  // Subscribe to auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
      } catch (err) {
        // Session fetch failed — user is logged out
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setIsLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  /**
   * Log in with email and password.
   * Redirects handled by middleware after session is set.
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError)
      }
    } catch {
      // Unexpected error — convert to AuthError format
      setError({ name: 'AuthError', message: 'Login failed' } as AuthError)
    } finally {
      setIsLoading(false)
    }
  }, [supabase.auth])

  /**
   * Log in with Google OAuth.
   * Redirects to Google, then to /auth/callback.
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError)
        setIsLoading(false)
      }
      // If successful, browser redirects — no need to setIsLoading(false)
    } catch {
      setError({ name: 'AuthError', message: 'Google login failed' } as AuthError)
      setIsLoading(false)
    }
  }, [supabase.auth])

  /**
   * Log out and clear session.
   * Middleware will redirect away from protected routes.
   */
  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        setError(authError)
      }
    } catch {
      setError({ name: 'AuthError', message: 'Logout failed' } as AuthError)
    } finally {
      setIsLoading(false)
    }
  }, [supabase.auth])

  /**
   * Sign up with email, password, and invite code.
   * Invite code is validated server-side before account creation.
   */
  const signup = useCallback(async (
    email: string,
    password: string,
    inviteCode: string
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate invite code first
      const validateResponse = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode }),
      })

      if (!validateResponse.ok) {
        const data = await validateResponse.json()
        setError({ name: 'AuthError', message: data.error || 'Invalid invite code' } as AuthError)
        setIsLoading(false)
        return
      }

      // Create account
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store invite code in metadata for potential tracking
          data: { invite_code: inviteCode },
        },
      })

      if (authError) {
        setError(authError)
      }
    } catch {
      setError({ name: 'AuthError', message: 'Signup failed' } as AuthError)
    } finally {
      setIsLoading(false)
    }
  }, [supabase.auth])

  return {
    user,
    session,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    signup,
  }
}
