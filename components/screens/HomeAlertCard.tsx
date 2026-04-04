// ============================================================
// ALMA · COMPONENTS · HomeAlertCard.tsx
// ============================================================
// What this file does: Active alert with severity border, dismiss
// Module: screens — Home screen components
// Depends on: components/ui/Card, lucide-react
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

import { X } from 'lucide-react'
import { Card } from '@/components/ui/Card'

// ─── TYPES ────────────────────────────────────────────────

type AlertPriority = 'low' | 'normal' | 'high' | 'urgent'

interface HomeAlertCardProps {
  id: string
  title: string
  body: string | null
  priority: AlertPriority
  onDismiss: (id: string) => void
}

// ─── CONSTANTS ────────────────────────────────────────────

const PRIORITY_COLORS: Record<AlertPriority, string> = {
  low: 'var(--text-secondary)',
  normal: 'var(--accent)',
  high: 'var(--warning)',
  urgent: 'var(--warm)',
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Alert card with severity-colored border and dismiss button.
 *
 * @param id - Alert ID for dismissal
 * @param title - Alert title
 * @param body - Alert body text
 * @param priority - Alert priority for border color
 * @param onDismiss - Callback when dismissed
 * @returns Alert card component
 */
export function HomeAlertCard({ id, title, body, priority, onDismiss }: HomeAlertCardProps) {
  const borderColor = PRIORITY_COLORS[priority]

  return (
    <Card className="mb-4 relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: borderColor }}
      />
      <div className="pl-3">
        <div className="flex items-start justify-between">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
          <button
            onClick={() => onDismiss(id)}
            className="p-1 rounded-full hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
        {body && (
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {body}
          </p>
        )}
      </div>
    </Card>
  )
}
