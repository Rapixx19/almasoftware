// ============================================================
// ALMA · COMPONENTS · Card.tsx
// ============================================================
// What this file does: Card container with accent/warm variants
// Module: ui — base UI primitives
// Depends on: lib/utils/cn.ts
// Used by: Home screen cards, stats, alerts
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

// ─── TYPES ────────────────────────────────────────────────

type CardVariant = 'default' | 'accent' | 'warm'

interface CardProps {
  children: ReactNode
  variant?: CardVariant
  className?: string
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Card container with optional accent border variants.
 * Default: surface background. Accent: cyan border. Warm: orange border.
 *
 * @param children - Card content
 * @param variant - Visual variant (default, accent, warm)
 * @param className - Additional classes
 * @returns Card container element
 */
export function Card({ children, variant = 'default', className }: CardProps) {
  const borderColor =
    variant === 'accent'
      ? 'var(--accent)'
      : variant === 'warm'
        ? 'var(--warm)'
        : 'var(--border)'

  return (
    <div
      className={cn('rounded-xl p-4', className)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${borderColor}`,
      }}
    >
      {children}
    </div>
  )
}
