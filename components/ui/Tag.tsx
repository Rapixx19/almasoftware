// ============================================================
// ALMA · COMPONENTS · Tag.tsx
// ============================================================
// What this file does: Color pill tags for status/category display
// Module: ui — base UI primitives
// Depends on: lib/utils/cn.ts
// Used by: Home screen, alerts, tasks
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

// ─── TYPES ────────────────────────────────────────────────

type TagColor = 'cyan' | 'green' | 'warm' | 'purple' | 'gold'

interface TagProps {
  children: ReactNode
  color?: TagColor
  className?: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const COLOR_MAP: Record<TagColor, string> = {
  cyan: 'var(--accent)',
  green: 'var(--success)',
  warm: 'var(--warm)',
  purple: 'var(--purple)',
  gold: 'var(--gold)',
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Colored pill tag for displaying status or categories.
 * Colors map to design system tokens.
 *
 * @param children - Tag content
 * @param color - Tag color variant
 * @param className - Additional classes
 * @returns Tag pill element
 */
export function Tag({ children, color = 'cyan', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full',
        'text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: `${COLOR_MAP[color]}20`,
        color: COLOR_MAP[color],
      }}
    >
      {children}
    </span>
  )
}
