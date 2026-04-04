// ============================================================
// ALMA · HOOKS · useSettings.ts
// ============================================================
// What this file does: Manages settings state with realtime updates
// Module: settings — user preferences and autonomy
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: app/app/settings/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AutonomyKey, AutonomySettings, UserProfile } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface UseSettingsReturn {
  autonomySettings: AutonomySettings | null
  profile: UserProfile | null
  isLoading: boolean
  error: Error | null
  updateAutonomy: (key: AutonomyKey, value: number) => Promise<void>
}

interface ProfileRow {
  id: string
  display_name: string | null
  timezone: string | null
  current_mode: string | null
  autonomy_settings: AutonomySettings | null
  created_at: string | null
  updated_at: string | null
}

// ─── CONSTANTS ────────────────────────────────────────────

const DEBOUNCE_MS = 300

const DEFAULT_AUTONOMY: AutonomySettings = {
  messages: 50,
  calendar: 50,
  smart_home: 50,
}

// ─── HELPERS ──────────────────────────────────────────────

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    display_name: row.display_name || '',
    timezone: row.timezone || 'UTC',
    mode: (row.current_mode as 'standard' | 'elderly') || 'standard',
    autonomy_settings: row.autonomy_settings,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

// ─── HOOK ─────────────────────────────────────────────────

/**
 * Hook for managing user settings with realtime updates.
 * Includes debounced optimistic updates for sliders.
 */
export function useSettings(): UseSettingsReturn {
  const [autonomySettings, setAutonomySettings] = useState<AutonomySettings | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdates = useRef<Map<AutonomyKey, number>>(new Map())

  // Initial fetch and realtime subscription
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return

        // Fetch autonomy settings via API
        const res = await fetch('/api/settings/autonomy')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch settings')

        if (isMounted) {
          setAutonomySettings(data.settings || DEFAULT_AUTONOMY)
        }

        // Fetch profile directly for display name
        const { data: profileData, error: profileError } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw new Error(profileError.message)

        if (isMounted && profileData) {
          setProfile(toUserProfile(profileData as unknown as ProfileRow))
          setIsLoading(false)
        }

        // Subscribe to realtime updates
        const channel = supabase
          .channel(`settings-${user.id}`)
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
              const row = payload.new as ProfileRow
              setProfile(toUserProfile(row))
              if (row.autonomy_settings) {
                setAutonomySettings(row.autonomy_settings)
              }
            }
          )
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load settings'))
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [supabase])

  // Debounced update function
  const updateAutonomy = useCallback(async (key: AutonomyKey, value: number) => {
    // Optimistic update
    setAutonomySettings((prev) => {
      if (!prev) return prev
      return { ...prev, [key]: value }
    })
    setError(null)

    // Track pending update
    pendingUpdates.current.set(key, value)

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce the API call
    debounceRef.current = setTimeout(async () => {
      // Get all pending updates
      const updates = Array.from(pendingUpdates.current.entries())
      pendingUpdates.current.clear()

      // Send each update
      for (const [updateKey, updateValue] of updates) {
        try {
          const res = await fetch('/api/settings/autonomy', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: updateKey, value: updateValue }),
          })

          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to update')
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to update'))
          // Refetch to restore correct state
          const refetchRes = await fetch('/api/settings/autonomy')
          if (refetchRes.ok) {
            const data = await refetchRes.json()
            setAutonomySettings(data.settings || DEFAULT_AUTONOMY)
          }
        }
      }
    }, DEBOUNCE_MS)
  }, [])

  return {
    autonomySettings,
    profile,
    isLoading,
    error,
    updateAutonomy,
  }
}
