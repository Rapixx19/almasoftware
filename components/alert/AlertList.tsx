// ============================================================
// ALMA · COMPONENTS · AlertList.tsx
// ============================================================
// What this file does: Renders list of alerts with filter tabs
// Module: alerts — see modules/alerts/README.md
// Depends on: components/alert/AlertCard.tsx, hooks/useMode.ts
// Used by: app/app/alerts/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { Bell } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'
import AlertCard from './AlertCard'

// ─── TYPES ────────────────────────────────────────────────

interface AlertListProps {
  alerts: AlmaAlert[]
  isLoading: boolean
  filterSeverity: AlertSeverity | null
  filterDismissed: boolean | null
  onSeverityChange: (severity: AlertSeverity | null) => void
  onDismissedChange: (dismissed: boolean | null) => void
  onDismiss: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const STATUS_FILTERS: { value: boolean | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: false, label: 'Active' },
  { value: true, label: 'Dismissed' },
]

const SEVERITY_FILTERS: { value: AlertSeverity | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const SEVERITY_ORDER: Record<AlertSeverity, number> = { urgent: 0, medium: 1, low: 2 }

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Renders a filterable list of alerts.
 * Handles loading, empty, and populated states (Rule 09).
 */
export default function AlertList({
  alerts, isLoading, filterSeverity, filterDismissed,
  onSeverityChange, onDismissedChange, onDismiss, onDelete
}: AlertListProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const fontSize = isElderly ? '16px' : '14px'

  // Sort: undismissed first, then by severity (urgent→medium→low), then by created_at
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.is_dismissed !== b.is_dismissed) return a.is_dismissed ? 1 : -1
    if (a.severity !== b.severity) return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading alerts...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onDismissedChange(f.value)}
            className="px-3 py-2 rounded-full whitespace-nowrap transition-colors"
            style={{
              fontSize,
              backgroundColor: filterDismissed === f.value ? 'var(--accent)' : 'var(--bg-surface)',
              color: filterDismissed === f.value ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Severity filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {SEVERITY_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onSeverityChange(f.value)}
            className="px-3 py-2 rounded-full whitespace-nowrap transition-colors"
            style={{
              fontSize,
              backgroundColor: filterSeverity === f.value ? 'var(--accent)' : 'var(--bg-surface)',
              color: filterSeverity === f.value ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert list or empty state */}
      {sortedAlerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {sortedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onDismiss={onDismiss} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <Bell size={32} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
        No alerts. You&apos;re all caught up!
      </p>
    </div>
  )
}
