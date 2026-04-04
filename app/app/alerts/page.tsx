// ============================================================
// ALMA · APP · alerts/page.tsx
// ============================================================
// What this file does: Alert management page
// Module: alerts — see modules/alerts/README.md
// Depends on: hooks/useAlerts.ts, components/alert/*
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useMode } from '@/hooks/useMode'
import { useAlerts } from '@/hooks/useAlerts'
import { AlertList } from '@/components/alert'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Alert management page.
 * Displays list of alerts with severity and status filters.
 * No add button — alerts are system-generated.
 */
export default function AlertsPage() {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  const {
    alerts,
    isLoading,
    error,
    dismissAlert,
    deleteAlert,
    filterSeverity,
    setFilterSeverity,
    filterDismissed,
    setFilterDismissed,
    undismissedCount,
  } = useAlerts()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1
          className="font-bold"
          style={{
            fontSize: isElderly ? '28px' : '24px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          Alerts
        </h1>

        {/* Undismissed count badge */}
        {undismissedCount > 0 && (
          <span
            className="px-2.5 py-0.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: 'var(--error)',
              color: 'white',
            }}
          >
            {undismissedCount}
          </span>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div
          className="p-3 rounded-lg mb-4"
          style={{
            backgroundColor: 'var(--error)',
            color: 'white',
          }}
        >
          {error.message}
        </div>
      )}

      {/* Alert list */}
      <AlertList
        alerts={alerts}
        isLoading={isLoading}
        filterSeverity={filterSeverity}
        filterDismissed={filterDismissed}
        onSeverityChange={setFilterSeverity}
        onDismissedChange={setFilterDismissed}
        onDismiss={dismissAlert}
        onDelete={deleteAlert}
      />
    </div>
  )
}
