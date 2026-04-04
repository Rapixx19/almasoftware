// ============================================================
// ALMA · COMPONENTS · HomeBriefCard.tsx
// ============================================================
// What this file does: Dynamic morning brief with real data
// Module: screens — Home screen components
// Depends on: components/ui/Card, components/ui/Skeleton, lucide-react
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, AlertCircle, Brain, Sparkles } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface BriefItem {
  icon: 'calendar' | 'task' | 'memory' | 'greeting'
  text: string
}

interface HomeBriefCardProps {
  items?: BriefItem[]
  isLoading?: boolean
}

// ─── HELPERS ──────────────────────────────────────────────

function getIcon(type: BriefItem['icon']) {
  const iconProps = { size: 14, style: { flexShrink: 0 } }
  switch (type) {
    case 'calendar':
      return <Calendar {...iconProps} style={{ ...iconProps.style, color: 'var(--accent)' }} />
    case 'task':
      return <AlertCircle {...iconProps} style={{ ...iconProps.style, color: 'var(--warm)' }} />
    case 'memory':
      return <Brain {...iconProps} style={{ ...iconProps.style, color: 'var(--purple)' }} />
    case 'greeting':
      return <Sparkles {...iconProps} style={{ ...iconProps.style, color: 'var(--text-muted)' }} />
  }
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Dynamic morning brief card showing personalized daily summary.
 * Displays next event, priority tasks, last memory, and greeting.
 *
 * @param items - Array of brief items to display
 * @param isLoading - Show skeleton state
 * @returns Brief card component
 */
export function HomeBriefCard({ items, isLoading }: HomeBriefCardProps) {
  if (isLoading) {
    return (
      <Card className="mb-4">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-2" />
        <Skeleton className="h-3 w-5/6" />
      </Card>
    )
  }

  // Default items if none provided
  const displayItems: BriefItem[] = items?.length ? items : [
    { icon: 'greeting', text: 'Ready to help you today' },
  ]

  return (
    <Card className="mb-4">
      <h3
        className="text-sm font-medium mb-3"
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
      >
        Today
      </h3>
      <ul className="space-y-2">
        {displayItems.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            {getIcon(item.icon)}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
