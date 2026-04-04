// ============================================================
// ALMA · COMPONENTS · UrgentAlert.tsx
// ============================================================
// What this file does: URGENT severity alert as full-screen overlay
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/alma/AlmaAlert.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { AlertCircle, Bell } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface UrgentAlertProps {
  alert: AlmaAlert
  onDismiss: (id: string) => Promise<void>
}

// ─── COMPONENT ────────────────────────────────────────────
// Full-screen overlay, must explicitly dismiss

export function UrgentAlert({ alert, onDismiss }: UrgentAlertProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
      style={{ backgroundColor: 'var(--overlay-dark)' }}
    >
      {/* Card */}
      <div
        className="mx-6 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center gap-3"
          style={{ backgroundColor: 'var(--error)' }}
        >
          <AlertCircle size={isElderly ? 28 : 24} color="white" />
          <span
            className="font-bold text-white"
            style={{ fontSize: isElderly ? '18px' : '16px' }}
          >
            Urgent Alert
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="font-semibold mb-2"
            style={{
              fontSize: isElderly ? '20px' : '18px',
              color: 'var(--text-primary)',
            }}
          >
            {alert.title}
          </h3>
          {alert.body && (
            <p
              style={{
                fontSize: isElderly ? '16px' : '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {alert.body}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => onDismiss(alert.id)}
              className="w-full py-3 rounded-xl font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--error)',
                color: 'white',
                fontSize: isElderly ? '16px' : '14px',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Bell size={isElderly ? 20 : 18} />
                Handle Now
              </span>
            </button>
            <button
              onClick={() => onDismiss(alert.id)}
              className="w-full py-3 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: isElderly ? '16px' : '14px',
                border: '1px solid var(--border)',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
