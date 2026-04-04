// ============================================================
// ALMA · HOOKS · useAlerts.ts
// ============================================================
// What this file does: Manages alert state with realtime updates
// Module: alerts — see modules/alerts/README.md
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: components/alert/AlertList.tsx, app/app/alerts/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface UseAlertsReturn {
  alerts: AlmaAlert[]
  isLoading: boolean
  error: Error | null
  dismissAlert: (id: string) => Promise<void>
  deleteAlert: (id: string) => Promise<void>
  filterSeverity: AlertSeverity | null
  setFilterSeverity: (severity: AlertSeverity | null) => void
  filterDismissed: boolean | null
  setFilterDismissed: (dismissed: boolean | null) => void
  undismissedCount: number
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

// ─── HOOK ─────────────────────────────────────────────────

/** Manages alerts with realtime updates and optimistic mutations. */
export function useAlerts(): UseAlertsReturn {
  const [alerts, setAlerts] = useState<AlmaAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | null>(null)
  const [filterDismissed, setFilterDismissed] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return
        setUserId(user.id)
        const params = new URLSearchParams()
        if (filterSeverity) params.set('severity', filterSeverity)
        if (filterDismissed !== null) params.set('dismissed', String(filterDismissed))
        const url = params.toString() ? `/api/alerts?${params}` : '/api/alerts'
        const res = await fetch(url)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch')
        if (isMounted) { setAlerts(data.alerts || []); setIsLoading(false) }

        const channel = supabase
          .channel(`alerts-${user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'alma_alerts', filter: `user_id=eq.${user.id}` },
            (payload) => {
              if (!isMounted) return
              if (payload.eventType === 'INSERT') {
                const alert = toAlmaAlert(payload.new as AlertRow)
                setAlerts((prev) => prev.some((a) => a.id === alert.id) ? prev : [alert, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                const alert = toAlmaAlert(payload.new as AlertRow)
                setAlerts((prev) => prev.map((a) => (a.id === alert.id ? alert : a)))
              } else if (payload.eventType === 'DELETE') {
                setAlerts((prev) => prev.filter((a) => a.id !== (payload.old as { id: string }).id))
              }
            })
          .subscribe()
        return () => { channel.unsubscribe() }
      } catch (err) {
        if (isMounted) { setError(err instanceof Error ? err : new Error('Failed to load')); setIsLoading(false) }
      }
    }
    init()
    return () => { isMounted = false }
  }, [supabase, filterSeverity, filterDismissed])

  const dismissAlert = useCallback(async (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, is_dismissed: true } : a)); setError(null)
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_dismissed: true }) })
      if (!res.ok) { const refetch = await fetch('/api/alerts'); setAlerts((await refetch.json()).alerts || []); throw new Error('Failed to dismiss') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to dismiss')) }
  }, [])

  const deleteAlert = useCallback(async (id: string) => {
    const prev = alerts
    setAlerts((p) => p.filter((a) => a.id !== id)); setError(null)
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
      if (!res.ok) { setAlerts(prev); throw new Error('Failed to delete') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to delete')) }
  }, [alerts])

  const undismissedCount = useMemo(() => alerts.filter((a) => !a.is_dismissed).length, [alerts])

  return {
    alerts, isLoading, error, dismissAlert, deleteAlert,
    filterSeverity, setFilterSeverity, filterDismissed, setFilterDismissed, undismissedCount
  }
}
