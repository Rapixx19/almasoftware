// ============================================================
// ALMA · COMPONENTS · HomeQuickActions.tsx
// ============================================================
// What this file does: 5 icon buttons for quick navigation
// Module: screens — Home screen components
// Depends on: lucide-react, next/link
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

import Link from 'next/link'
import {
  Plus,
  Calendar,
  Lightbulb,
  Settings,
  Monitor,
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface QuickAction {
  icon: typeof Plus
  label: string
  href: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Plus, label: 'New Task', href: '/app/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/app/calendar' },
  { icon: Lightbulb, label: 'Brainstorm', href: '/app/brainstorm' },
  { icon: Settings, label: 'Settings', href: '/app/settings' },
  { icon: Monitor, label: 'Display', href: '/app/settings' },
]

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Quick action buttons for common tasks.
 * 5 icon buttons with labels.
 *
 * @returns Quick actions grid component
 */
export function HomeQuickActions() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-1 p-3 rounded-xl transition-colors hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            <Icon
              size={24}
              style={{ color: 'var(--accent)' }}
            />
            <span
              className="text-xs text-center"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
            >
              {action.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
