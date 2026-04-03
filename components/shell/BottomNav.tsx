// ============================================================
// ALMA · COMPONENTS · BottomNav.tsx
// ============================================================
// What this file does: 5-tab bottom navigation for standard mode
// Module: shell — see modules/shell/README.md
// Depends on: lucide-react, next/link, next/navigation
// Used by: Shell.tsx (standard mode only)
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Lucide icons for visual nav, Next.js for routing.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageCircle,
  Calendar,
  Lightbulb,
  CheckSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

interface NavItem {
  icon: typeof MessageCircle
  label: string
  href: string
}

interface BottomNavProps {
  className?: string
}

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Centralized nav config for easy updates.

const NAV_ITEMS: NavItem[] = [
  { icon: MessageCircle, label: 'Chat', href: '/app' },
  { icon: Calendar, label: 'Calendar', href: '/app/calendar' },
  { icon: Lightbulb, label: 'Ideas', href: '/app/brainstorm' },
  { icon: CheckSquare, label: 'Tasks', href: '/app/tasks' },
  { icon: Settings, label: 'Settings', href: '/app/settings' },
]

// ─── COMPONENT ────────────────────────────────────────────
// Why: Bottom nav provides quick access to main app sections.

/**
 * Bottom navigation bar with 5 tabs for standard mode.
 * Height of 88px (64px visible + 24px safe area).
 * Touch targets minimum 44px per tab.
 *
 * @param className - Additional classes for customization
 * @returns Bottom navigation component
 */
export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname()

  // Determine active tab
  // Why: Exact match for /app, startsWith for nested routes
  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'flex items-start justify-around',
        className
      )}
      style={{
        height: 'var(--bottom-nav-height)',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        // Safe area padding for iOS
        paddingBottom: 'env(safe-area-inset-bottom, 24px)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center',
              'min-w-[44px] min-h-[44px]',
              'pt-2 pb-1 px-3',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'rounded-lg'
            )}
            style={{
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              // Focus ring color
              // @ts-expect-error CSS custom property
              '--tw-ring-color': 'var(--accent)',
              '--tw-ring-offset-color': 'var(--bg-surface)',
            }}
          >
            <Icon
              size={24}
              strokeWidth={active ? 2.5 : 2}
              className="mb-1"
            />
            <span
              className="text-xs"
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
