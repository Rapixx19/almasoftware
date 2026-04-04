// ============================================================
// ALMA · COMPONENTS · HomeStreakBadge.tsx
// ============================================================
// What this file does: Streak counter with celebration display
// Module: screens — Home screen components
// Depends on: lib/utils/cn
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { cn } from '@/lib/utils/cn'
import { Flame } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface HomeStreakBadgeProps {
  streak: number
  className?: string
}

// ─── HELPERS ──────────────────────────────────────────────

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Incredible dedication!'
  if (streak >= 14) return 'On fire!'
  if (streak >= 7) return 'Keep going!'
  if (streak >= 3) return 'Nice momentum!'
  return 'Getting started!'
}

function getStreakColor(streak: number): string {
  if (streak >= 14) return 'var(--warm)'
  if (streak >= 7) return 'var(--accent)'
  return 'var(--text-secondary)'
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Streak badge showing consecutive days active.
 * Color and message change based on streak length.
 *
 * @param streak - Number of consecutive days
 * @param className - Additional classes
 * @returns Streak badge component
 */
export function HomeStreakBadge({ streak, className }: HomeStreakBadgeProps) {
  if (streak < 1) return null

  const color = getStreakColor(streak)
  const message = getStreakMessage(streak)
  const isHot = streak >= 7

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
      }}
    >
      <Flame
        size={14}
        style={{ color }}
        className={cn(isHot && 'animate-pulse')}
      />
      <span
        className="text-xs font-medium"
        style={{ color, fontFamily: 'var(--font-mono)' }}
      >
        {streak}-day streak
      </span>
      {isHot && (
        <span
          className="text-xs ml-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {message}
        </span>
      )}
    </div>
  )
}
