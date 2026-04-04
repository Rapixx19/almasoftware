// ============================================================
// ALMA · COMPONENTS · LowAlert.tsx
// ============================================================
// What this file does: LOW severity alert as inline pulsing card
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/alma/AlmaAlert.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { Info } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface LowAlertProps {
  alert: AlmaAlert
  onDismiss: (id: string) => Promise<void>
}

// ─── COMPONENT ────────────────────────────────────────────
// Pulsing orange dot, muted card style, dismisses on tap

export function LowAlert({ alert, onDismiss }: LowAlertProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  return (
    <button
      onClick={() => onDismiss(alert.id)}
      className="w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Pulsing dot */}
      <div className="relative flex-shrink-0 mt-1">
        <div
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--warning)' }}
        />
        <div
          className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: 'var(--warning)' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-medium truncate"
          style={{
            fontSize: isElderly ? '15px' : '13px',
            color: 'var(--text-primary)',
          }}
        >
          {alert.title}
        </p>
        {alert.body && (
          <p
            className="truncate mt-0.5"
            style={{
              fontSize: isElderly ? '13px' : '11px',
              color: 'var(--text-tertiary)',
            }}
          >
            {alert.body}
          </p>
        )}
      </div>

      {/* Dismiss hint */}
      <Info
        size={isElderly ? 18 : 14}
        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
      />
    </button>
  )
}
