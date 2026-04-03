// ============================================================
// ALMA · COMPONENTS · SOSButton.tsx
// ============================================================
// What this file does: Emergency SOS button for elderly mode
// Module: shell — see modules/shell/README.md
// Depends on: lucide-react
// Used by: ElderlyShell.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: AlertCircle icon for visual urgency, cn for styling.

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

interface SOSButtonProps {
  className?: string
  onPress?: () => void
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Large, always-visible emergency button for elderly users.

/**
 * SOS emergency button with 100px touch target.
 * Uses warm/orange color for high visibility.
 * Fixed position for constant accessibility.
 *
 * @param className - Additional classes
 * @param onPress - Handler for SOS action (placeholder)
 * @returns SOS button component
 */
export function SOSButton({ className, onPress }: SOSButtonProps) {
  const handlePress = () => {
    // TODO: Phase-specific — implement emergency action
    // Options: phone call, alert family, notify emergency contacts
    if (onPress) {
      onPress()
    } else {
      // Placeholder: log to console
      console.log('[ALMA] SOS button pressed — emergency action placeholder')
    }
  }

  return (
    <button
      type="button"
      onClick={handlePress}
      className={cn(
        'fixed bottom-8 right-4 z-50',
        'flex items-center justify-center',
        'rounded-full',
        'shadow-lg',
        'transition-transform duration-150',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-4',
        className
      )}
      style={{
        width: '100px',
        height: '100px',
        minWidth: '100px',
        minHeight: '100px',
        backgroundColor: 'var(--warm)',
        color: 'white',
        // Focus ring in warm color
        // @ts-expect-error CSS custom property
        '--tw-ring-color': 'var(--warm)',
        '--tw-ring-opacity': '0.5',
      }}
      aria-label="Emergency SOS"
    >
      <div className="flex flex-col items-center">
        <AlertCircle size={32} strokeWidth={2.5} />
        <span
          className="text-sm font-bold mt-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          SOS
        </span>
      </div>
    </button>
  )
}
