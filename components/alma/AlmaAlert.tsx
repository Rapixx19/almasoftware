// ============================================================
// ALMA · COMPONENTS · AlmaAlert.tsx
// ============================================================
// What this file does: Routes to severity-specific alert components
// Module: alerts — see modules/alerts/README.md
// Depends on: types/alma.ts, ./LowAlert, ./MediumAlert, ./UrgentAlert
// Used by: components/shell/Shell.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import type { AlmaAlert as AlmaAlertType } from '@/types/alma'
import { LowAlert } from './LowAlert'
import { MediumAlert } from './MediumAlert'
import { UrgentAlert } from './UrgentAlert'

// ─── TYPES ────────────────────────────────────────────────

export type AlertVariant = 'low' | 'medium' | 'urgent'

interface AlmaAlertProps {
  alert: AlmaAlertType
  variant: AlertVariant
  onDismiss: (id: string) => Promise<void>
  onSnooze?: (id: string, minutes: number) => Promise<void>
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Routes to the appropriate severity-based alert component.
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
