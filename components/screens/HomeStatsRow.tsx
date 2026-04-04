// ============================================================
// ALMA · COMPONENTS · HomeStatsRow.tsx
// ============================================================
// What this file does: 3 stat cards showing tasks, memories, days
// Module: screens — Home screen components
// Depends on: components/ui/Card, components/ui/Skeleton
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

// ─── TYPES ────────────────────────────────────────────────

interface HomeStatsRowProps {
  tasksCompletedToday: number
  memoriesCount: number
  daysActive: number
  isLoading?: boolean
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Row of 3 stat cards: tasks done today, memories, days active.
 *
 * @param tasksCompletedToday - Tasks completed today
 * @param memoriesCount - Total memories count
 * @param daysActive - Days since account creation
 * @param isLoading - Show skeleton state
 * @returns Stats row component
 */
export function HomeStatsRow({
  tasksCompletedToday,
  memoriesCount,
  daysActive,
  isLoading,
}: HomeStatsRowProps) {
  const stats = [
    { label: 'Done Today', value: tasksCompletedToday },
    { label: 'Memories', value: memoriesCount },
    { label: 'Days Active', value: daysActive },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="text-center py-3">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="text-center py-3">
          <div
            className="text-xl font-bold"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
          >
            {stat.value}
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  )
}
