// ============================================================
// ALMA · COMPONENTS · ElderlyShell.tsx
// ============================================================
// What this file does: Simplified layout for elderly mode users
// Module: shell — see modules/shell/README.md
// Depends on: SOSButton.tsx, lucide-react, next/link
// Used by: Shell.tsx (elderly mode only)
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Lucide icons, Next Link, SOSButton for emergency access.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Pill, Phone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SOSButton } from './SOSButton'

// ─── TYPES ────────────────────────────────────────────────

interface ElderlyShellProps {
  children: React.ReactNode
}

interface ActionButton {
  icon: typeof MessageCircle
  label: string
  href?: string
  action?: () => void
}

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Three large action buttons — core elderly user needs.

const ACTION_BUTTONS: ActionButton[] = [
  { icon: MessageCircle, label: 'Talk to Alma', href: '/app' },
  { icon: Pill, label: 'Medications', href: '/app/medications' },
  { icon: Phone, label: 'Call Family', action: () => handleCallFamily() },
]

// ─── HELPERS ──────────────────────────────────────────────

function handleCallFamily() {
  // TODO: Phase-specific — implement call functionality
  // Options: tel: link to emergency contact, VoIP integration
  console.log('[ALMA] Call Family pressed — placeholder')
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Simplified UI with large touch targets for accessibility.

/**
 * Elderly mode shell with simplified navigation.
 * Large time display, 3 action buttons (80px+ targets), and SOS.
 *
 * @param children - Page content
 * @returns Elderly-optimized shell layout
 */
export function ElderlyShell({ children }: ElderlyShellProps) {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  // Update time every second
  // Why: Large clock is primary orientation for elderly users
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      // Time in HH:MM format
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)

      // Date in readable format
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }
      setDate(now.toLocaleDateString('en-US', options))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--bg-base)',
        // Larger base font for elderly mode
        fontSize: '20px',
      }}
    >
      {/* Time header — large and prominent */}
      <header
        className="flex flex-col items-center justify-center py-8"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div
          className="font-bold"
          style={{
            fontSize: '48px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
          }}
        >
          {time}
        </div>
        <div
          className="mt-2"
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {date}
        </div>
      </header>

      {/* Action buttons — large touch targets */}
      <nav className="flex flex-col gap-4 p-6">
        {ACTION_BUTTONS.map((button) => {
          const Icon = button.icon
          const ButtonWrapper = button.href ? Link : 'button'
          const props = button.href
            ? { href: button.href }
            : { onClick: button.action, type: 'button' as const }

          return (
            <ButtonWrapper
              key={button.label}
              {...props}
              className={cn(
                'flex items-center gap-6',
                'w-full py-6 px-8',
                'rounded-xl',
                'transition-all duration-150',
                'active:scale-98',
                'focus-visible:outline-none focus-visible:ring-4'
              )}
              style={{
                minHeight: '80px',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border)',
                // Gold accent for elderly mode
                // @ts-expect-error CSS custom property
                '--tw-ring-color': 'var(--gold)',
              }}
            >
              <Icon
                size={40}
                style={{ color: 'var(--gold)' }}
              />
              <span
                className="font-medium"
                style={{
                  fontSize: '24px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {button.label}
              </span>
            </ButtonWrapper>
          )
        })}
      </nav>

      {/* Content area — simplified */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* SOS button — always visible */}
      <SOSButton />
    </div>
  )
}
