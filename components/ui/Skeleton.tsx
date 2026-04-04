// ============================================================
// ALMA · COMPONENTS · Skeleton.tsx
// ============================================================
// What this file does: Animated pulse loading placeholder
// Module: ui — base UI primitives
// Depends on: lib/utils/cn.ts
// Used by: Home screen components during loading
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Animated skeleton placeholder for loading states.
 * Uses CSS animation for smooth pulsing effect.
 *
 * @param className - Additional classes for sizing
 * @returns Skeleton placeholder element
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md', className)}
      style={{ backgroundColor: 'var(--bg-dim)' }}
    />
  )
}
