// ============================================================
// ALMA · HOOKS · useRealtimeAlerts.ts
// ============================================================
// What this file does: Lightweight global hook for alert display in layout
// Module: alerts — see modules/alerts/README.md
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: components/shell/Shell.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface UseRealtimeAlertsReturn {
  activeAlerts: AlmaAlert[]
  urgentAlert: AlmaAlert | null
  mediumAlerts: AlmaAlert[]
  lowAlerts: AlmaAlert[]
  dismissAlert: (id: string) => Promise<void>
  snoozeAlert: (id: string, minutes: number) => Promise<void>
}

interface AlertRow {
  id: string
  user_id: string
  title: string
  body: string | null
  priority: string | null
  read_at: string | null
  snoozed_until: string | null
  created_at: string | null
}

// ─── HELPERS ──────────────────────────────────────────────

function mapPriorityToSeverity(priority: string | null): AlertSeverity {
  if (priority === 'urgent') return 'urgent'
  if (priority === 'high' || priority === 'normal') return 'medium'
  return 'low'
}

function toAlmaAlert(row: AlertRow): AlmaAlert {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    body: row.body || '',
    severity: mapPriorityToSeverity(row.priority),
    is_dismissed: row.read_at !== null,
    snoozed_until: row.snoozed_until,
    created_at: row.created_at || new Date().toISOString(),
  }
}

/** Checks if an alert is currently snoozed. */
function isSnoozed(alert: AlmaAlert): boolean {
  if (!alert.snoozed_until) return false
  return new Date(alert.snoozed_until) > new Date()
}

// ─── HOOK ─────────────────────────────────────────────────

/**
 * Lightweight global hook for displaying alerts in the app shell.
 * Provides realtime updates with fallback polling.
 * Filters out dismissed and snoozed alerts automatically.
 */
export function useRealtimeAlerts(): UseRealtimeAlertsReturn {
  const [alerts, setAlerts] = useState<AlmaAlert[]>([])
  const [realtimeActive, setRealtimeActive] = useState(true)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const supabase = createClient()

  // Fetch alerts from API
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?dismissed=false')
      const data = await res.json()
      if (res.ok && data.alerts) {
        setAlerts(data.alerts)
      }
    } catch {
      // Silent fail for background fetch
    }
  }, [])

  // Initial fetch and realtime subscription
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      // Initial fetch
      await fetchAlerts()

      // Realtime subscription
      const channel = supabase
        .channel(`realtime-alerts-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'alma_alerts',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isMounted) return
            if (payload.eventType === 'INSERT') {
              const alert = toAlmaAlert(payload.new as AlertRow)
              setAlerts((prev) =>
                prev.some((a) => a.id === alert.id) ? prev : [alert, ...prev]
              )
            } else if (payload.eventType === 'UPDATE') {
              const alert = toAlmaAlert(payload.new as AlertRow)
              setAlerts((prev) =>
                prev.map((a) => (a.id === alert.id ? alert : a))
              )
            } else if (payload.eventType === 'DELETE') {
              const oldAlert = payload.old as { id: string }
              setAlerts((prev) => prev.filter((a) => a.id !== oldAlert.id))
            }
          }
        )
        .on('system', { event: 'disconnect' }, () => {
          if (isMounted) setRealtimeActive(false)
        })
        .on('system', { event: 'connected' }, () => {
          if (isMounted) setRealtimeActive(true)
        })
        .subscribe()

      return () => {
        channel.unsubscribe()
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [supabase, fetchAlerts])

  // Fallback polling when realtime drops
  useEffect(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    if (!realtimeActive) {
      pollIntervalRef.current = setInterval(fetchAlerts, 30000)
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [realtimeActive, fetchAlerts])

  // Re-check snoozed alerts periodically
  useEffect(() => {
    const checkSnooze = setInterval(() => {
      setAlerts((prev) => [...prev]) // Trigger re-render to re-evaluate snoozed state
    }, 60000) // Check every minute

    return () => clearInterval(checkSnooze)
  }, [])

  // Filter active alerts (non-dismissed, non-snoozed)
  const activeAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.is_dismissed) return false
      if (isSnoozed(a)) return false
      return true
    })
  }, [alerts])

  // Categorize by severity
  const urgentAlert = useMemo(() => {
    const urgents = activeAlerts.filter((a) => a.severity === 'urgent')
    return urgents[0] || null
  }, [activeAlerts])

  const mediumAlerts = useMemo(() => {
    return activeAlerts.filter((a) => a.severity === 'medium')
  }, [activeAlerts])

  const lowAlerts = useMemo(() => {
    return activeAlerts.filter((a) => a.severity === 'low')
  }, [activeAlerts])

  // Dismiss alert
  const dismissAlert = useCallback(async (id: string) => {
    // Optimistic update
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_dismissed: true } : a))
    )

    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      })
      if (!res.ok) {
        // Revert on failure
        await fetchAlerts()
      }
    } catch {
      await fetchAlerts()
    }
  }, [fetchAlerts])

  // Snooze alert
  const snoozeAlert = useCallback(async (id: string, minutes: number) => {
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()

    // Optimistic update
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, snoozed_until: snoozedUntil } : a))
    )

    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', snooze_minutes: minutes }),
      })
      if (!res.ok) {
        await fetchAlerts()
      }
    } catch {
      await fetchAlerts()
    }
  }, [fetchAlerts])

  return {
    activeAlerts,
    urgentAlert,
    mediumAlerts,
    lowAlerts,
    dismissAlert,
    snoozeAlert,
  }
}
