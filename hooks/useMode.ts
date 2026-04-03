// ============================================================
// ALMA · HOOKS · useMode.ts
// ============================================================
// What this file does: Provides mode state (standard/elderly) from DB
// Module: shell — see modules/shell/README.md
// Depends on: lib/supabase/client.ts, @supabase/supabase-js
// Used by: Shell.tsx, components that need mode-aware rendering
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Browser client for DB access, React hooks for state.

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── TYPES ────────────────────────────────────────────────
// Why: Explicit types for mode values and hook return.

export type AppMode = 'standard' | 'elderly'

interface UseModeReturn {
  mode: AppMode
  isLoading: boolean
  error: Error | null
  setMode: (mode: AppMode) => Promise<void>
  isModeLocked: boolean
}

// ─── HOOK ─────────────────────────────────────────────────
// Why: Centralizes mode logic for shell rendering decisions.

/**
 * Hook providing current app mode (standard/elderly) from user profile.
 * Subscribes to realtime changes for mode updates.
 *
 * @returns Mode state, loading state, error, setter, and lock status
 * @throws Never throws — errors captured in error state
 * @example
 * const { mode, isLoading, setMode } = useMode()
 * if (isLoading) return <Skeleton />
 * if (mode === 'elderly') return <ElderlyShell />
 */
export function useMode(): UseModeReturn {
  const [mode, setModeState] = useState<AppMode>('standard')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isModeLocked, setIsModeLocked] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Initialize Supabase client once
  const supabase = createClient()

  // Fetch initial mode and subscribe to changes
  useEffect(() => {
    let isMounted = true

    const fetchModeAndSubscribe = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          // Not authenticated — use default mode
          if (isMounted) {
            setIsLoading(false)
          }
          return
        }

        if (isMounted) {
          setUserId(user.id)
        }

        // Fetch current mode from profile
        const { data, error: fetchError } = await supabase
          .from('users_profile')
          .select('current_mode, mode_locked')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          // Profile might not exist yet — use defaults
          if (isMounted) {
            setIsLoading(false)
          }
          return
        }

        if (isMounted && data) {
          // Parse mode — default to 'standard' if null or invalid
          const fetchedMode = data.current_mode
          if (fetchedMode === 'standard' || fetchedMode === 'elderly') {
            setModeState(fetchedMode)
          }
          setIsModeLocked(data.mode_locked ?? false)
          setIsLoading(false)
        }

        // Subscribe to realtime changes on this user's profile
        // Why: Mode can be changed from another device or by admin
        const channel = supabase
          .channel(`profile-mode-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'users_profile',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (!isMounted) return

              const newData = payload.new as {
                current_mode?: string | null
                mode_locked?: boolean | null
              }

              const newMode = newData.current_mode
              if (newMode === 'standard' || newMode === 'elderly') {
                setModeState(newMode)
              }
              setIsModeLocked(newData.mode_locked ?? false)
            }
          )
          .subscribe()

        // Cleanup subscription on unmount
        return () => {
          channel.unsubscribe()
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch mode'))
          setIsLoading(false)
        }
      }
    }

    fetchModeAndSubscribe()

    return () => {
      isMounted = false
    }
  }, [supabase])

  /**
   * Update mode in database.
   * Only works if mode is not locked.
   */
  const setMode = useCallback(async (newMode: AppMode) => {
    if (isModeLocked) {
      setError(new Error('Mode is locked and cannot be changed'))
      return
    }

    if (!userId) {
      setError(new Error('User not authenticated'))
      return
    }

    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('users_profile')
        .update({ current_mode: newMode })
        .eq('id', userId)

      if (updateError) {
        setError(new Error(updateError.message))
        return
      }

      // Optimistic update — realtime will confirm
      setModeState(newMode)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update mode'))
    }
  }, [supabase, userId, isModeLocked])

  return {
    mode,
    isLoading,
    error,
    setMode,
    isModeLocked,
  }
}
