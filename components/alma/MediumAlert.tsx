// ============================================================
// ALMA · COMPONENTS · MediumAlert.tsx
// ============================================================
// What this file does: MEDIUM severity alert as fixed banner
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/alma/AlmaAlert.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react'
import { AlertTriangle, X, Clock } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface MediumAlertProps {
  alert: AlmaAlert
  onDismiss: (id: string) => Promise<void>
  onSnooze?: ((id: string, minutes: number) => Promise<void>) | undefined
}

// ─── COMPONENT ────────────────────────────────────────────
// Fixed banner with countdown, auto-dismiss after 5s

export function MediumAlert({ alert, onDismiss, onSnooze }: MediumAlertProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [progress, setProgress] = useState(100)
  const AUTO_DISMISS_MS = 5000

  // Auto-dismiss countdown
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss(alert.id)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [alert.id, onDismiss])

  const handleSnooze = useCallback(() => {
    if (onSnooze) {
      onSnooze(alert.id, 10)
    }
  }, [alert.id, onSnooze])

  return (
    <div
      className="fixed left-0 right-0 z-40 animate-in slide-in-from-top duration-300"
      style={{ top: 'var(--status-bar-height, 44px)' }}
    >
      {/* Banner content */}
      <div
        className="mx-3 rounded-xl overflow-hidden shadow-lg"
        style={{
          backgroundColor: 'var(--warning)',
          color: 'white',
        }}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <AlertTriangle
            size={isElderly ? 24 : 20}
            className="flex-shrink-0 mt-0.5"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold"
              style={{ fontSize: isElderly ? '16px' : '14px' }}
            >
              {alert.title}
            </p>
            {alert.body && (
              <p
                className="mt-1 opacity-90"
                style={{ fontSize: isElderly ? '14px' : '12px' }}
              >
                {alert.body}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onDismiss(alert.id)}
                className="px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--overlay-white-20)',
                  fontSize: isElderly ? '14px' : '12px',
                }}
              >
                Dismiss
              </button>
              {onSnooze && (
                <button
                  onClick={handleSnooze}
                  className="px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                  style={{
                    backgroundColor: 'var(--overlay-white-20)',
                    fontSize: isElderly ? '14px' : '12px',
                  }}
                >
                  <Clock size={isElderly ? 14 : 12} />
                  Snooze 10min
                </button>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => onDismiss(alert.id)}
            className="flex-shrink-0 p-1 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--overlay-white-10)' }}
            aria-label="Dismiss"
          >
            <X size={isElderly ? 20 : 16} />
          </button>
        </div>

        {/* Countdown bar */}
        <div
          className="h-1 transition-all duration-50"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--overlay-white-50)',
          }}
        />
      </div>
    </div>
  )
}
