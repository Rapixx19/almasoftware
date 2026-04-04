// ============================================================
// ALMA · COMPONENTS · AlertCard.tsx
// ============================================================
// What this file does: Renders a single alert with dismiss/delete
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/alert/AlertList.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { Info, AlertTriangle, AlertCircle, X, Trash2 } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface AlertCardProps {
  alert: AlmaAlert
  onDismiss: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const SEVERITY_STYLES: Record<AlertSeverity, { bg: string; border: string; text: string; icon: string }> = {
  low: { bg: 'var(--bg-surface)', border: 'var(--border)', text: 'var(--text-secondary)', icon: 'var(--text-tertiary)' },
  medium: { bg: 'var(--warning-bg, rgba(234, 179, 8, 0.1))', border: 'var(--warning)', text: 'var(--text-primary)', icon: 'var(--warning)' },
  urgent: { bg: 'var(--error-bg, rgba(239, 68, 68, 0.1))', border: 'var(--error)', text: 'var(--text-primary)', icon: 'var(--error)' },
}

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  urgent: 'Urgent',
}

// ─── HELPERS ──────────────────────────────────────────────

function SeverityIcon({ severity, size }: { severity: AlertSeverity; size: number }) {
  const color = SEVERITY_STYLES[severity].icon
  if (severity === 'urgent') return <AlertCircle size={size} style={{ color }} />
  if (severity === 'medium') return <AlertTriangle size={size} style={{ color }} />
  return <Info size={size} style={{ color }} />
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── COMPONENT ────────────────────────────────────────────

export default function AlertCard({ alert, onDismiss, onDelete }: AlertCardProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const fontSize = isElderly ? '16px' : '14px'
  const buttonSize = isElderly ? 24 : 18
  const iconSize = isElderly ? 28 : 22
  const styles = SEVERITY_STYLES[alert.severity]

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: styles.bg,
        borderLeft: `4px solid ${styles.border}`,
        opacity: alert.is_dismissed ? 0.6 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <SeverityIcon severity={alert.severity} size={iconSize} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Severity badge */}
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: styles.border, color: alert.severity === 'low' ? 'var(--text-primary)' : 'white' }}
            >
              {SEVERITY_LABELS[alert.severity]}
            </span>
            {/* Timestamp */}
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {formatTimestamp(alert.created_at)}
            </span>
          </div>

          {/* Title */}
          <p
            style={{
              fontSize,
              fontWeight: 600,
              color: styles.text,
              textDecoration: alert.is_dismissed ? 'line-through' : 'none',
              lineHeight: '1.4',
            }}
          >
            {alert.title}
          </p>

          {/* Body */}
          {alert.body && (
            <p
              className="mt-1"
              style={{
                fontSize: isElderly ? '14px' : '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                textDecoration: alert.is_dismissed ? 'line-through' : 'none',
              }}
            >
              {alert.body}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {!alert.is_dismissed && (
            <button onClick={() => onDismiss(alert.id)} aria-label="Dismiss alert" title="Dismiss">
              <X size={buttonSize} style={{ color: 'var(--text-secondary)' }} />
            </button>
          )}
          <button onClick={() => onDelete(alert.id)} aria-label="Delete alert" title="Delete">
            <Trash2 size={buttonSize} style={{ color: 'var(--error)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
