// ============================================================
// ALMA · COMPONENTS · AlmaAlert.tsx
// ============================================================
// What this file does: Renders alerts with three severity-based styles
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/shell/Shell.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react'
import { AlertCircle, AlertTriangle, Info, X, Clock, Bell } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaAlert as AlmaAlertType } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export type AlertVariant = 'low' | 'medium' | 'urgent'

interface AlmaAlertProps {
  alert: AlmaAlertType
  variant: AlertVariant
  onDismiss: (id: string) => Promise<void>
  onSnooze?: (id: string, minutes: number) => Promise<void>
}

// ─── LOW SEVERITY (INLINE) ────────────────────────────────
// Pulsing orange dot, muted card style, dismisses on tap

function LowAlert({ alert, onDismiss }: Omit<AlmaAlertProps, 'variant' | 'onSnooze'>) {
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

// ─── MEDIUM SEVERITY (BANNER) ─────────────────────────────
// Fixed banner with countdown, auto-dismiss after 5s

interface MediumAlertProps {
  alert: AlmaAlertType
  onDismiss: (id: string) => Promise<void>
  onSnooze?: ((id: string, minutes: number) => Promise<void>) | undefined
}

function MediumAlert({ alert, onDismiss, onSnooze }: MediumAlertProps) {
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
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
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
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
    </div>
  )
}

// ─── URGENT SEVERITY (OVERLAY) ────────────────────────────
// Full-screen overlay, must explicitly dismiss

function UrgentAlert({ alert, onDismiss }: Omit<AlmaAlertProps, 'variant' | 'onSnooze'>) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
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

// ─── MAIN COMPONENT ───────────────────────────────────────

/**
 * Renders an alert with severity-based styling.
 * - LOW: Inline pulsing card, tap to dismiss
 * - MEDIUM: Top banner with countdown, action buttons
 * - URGENT: Full-screen overlay, explicit dismissal required
 */
export function AlmaAlert({ alert, variant, onDismiss, onSnooze }: AlmaAlertProps) {
  if (variant === 'low') {
    return <LowAlert alert={alert} onDismiss={onDismiss} />
  }

  if (variant === 'medium') {
    return <MediumAlert alert={alert} onDismiss={onDismiss} onSnooze={onSnooze} />
  }

  if (variant === 'urgent') {
    return <UrgentAlert alert={alert} onDismiss={onDismiss} />
  }

  return null
}
