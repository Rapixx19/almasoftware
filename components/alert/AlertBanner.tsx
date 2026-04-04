// ============================================================
// ALMA · COMPONENTS · AlertBanner.tsx
// ============================================================
// What this file does: Horizontal banner for medium/urgent alerts
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, lucide-react
// Used by: App shell, layout components
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { AlertTriangle, AlertCircle, X } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface AlertBannerProps {
  alert: AlmaAlert
  onDismiss: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const SEVERITY_STYLES: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  low: { bg: 'var(--bg-surface)', text: 'var(--text-primary)', border: 'var(--border)' },
  medium: { bg: 'var(--warning)', text: 'white', border: 'var(--warning)' },
  urgent: { bg: 'var(--error)', text: 'white', border: 'var(--error)' },
}

// ─── HELPERS ──────────────────────────────────────────────

function BannerIcon({ severity, size }: { severity: AlertSeverity; size: number }) {
  if (severity === 'urgent') return <AlertCircle size={size} />
  return <AlertTriangle size={size} />
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Horizontal banner for important alerts.
 * Fixed at top of page, dismissed via X button.
 */
export default function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const styles = SEVERITY_STYLES[alert.severity]
  const fontSize = isElderly ? '16px' : '14px'
  const iconSize = isElderly ? 22 : 18

  return (
    <div
      className="w-full px-4 py-3 flex items-center gap-3"
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderBottom: `1px solid ${styles.border}`,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <BannerIcon severity={alert.severity} size={iconSize} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ fontSize }}>
          {alert.title}
        </p>
        {alert.body && (
          <p className="truncate opacity-90" style={{ fontSize: isElderly ? '14px' : '12px' }}>
            {alert.body}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(alert.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
        aria-label="Dismiss alert"
      >
        <X size={isElderly ? 24 : 20} />
      </button>
    </div>
  )
}
