// ============================================================
// ALMA · COMPONENTS · StatusBar.tsx
// ============================================================
// What this file does: Top status bar with time, branding, and indicators
// Module: shell — see modules/shell/README.md
// Depends on: lib/utils/cn.ts
// Used by: Shell.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: React for state, cn for class merging.

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

interface StatusBarProps {
  className?: string
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Fixed top bar shows time and branding for context.

/**
 * Top status bar displaying time and ALMA branding.
 * Fixed height of 54px matching --status-bar-height token.
 *
 * @param className - Additional classes for customization
 * @returns Status bar component
 */
export function StatusBar({ className }: StatusBarProps) {
  const [time, setTime] = useState<string>('')

  // Update time every second
  // Why: Live clock provides ambient awareness
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)
    }

    // Initial update
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between',
        'px-4',
        className
      )}
      style={{
        height: 'var(--status-bar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Time display — left side */}
      <div
        className="text-sm"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
        }}
      >
        {time}
      </div>

      {/* ALMA branding — center */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-wider"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--accent)',
        }}
      >
        ALMA
      </div>

      {/* Status indicators — right side (placeholder) */}
      {/* Why: Reserved space for future indicators like connection status */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--success)' }}
          title="Connected"
        />
      </div>
    </header>
  )
}
