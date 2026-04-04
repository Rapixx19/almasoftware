// ============================================================
// ALMA · COMPONENTS · Shell.tsx
// ============================================================
// What this file does: Main app wrapper that renders mode-aware layout
// Module: shell — see modules/shell/README.md
// Depends on: useMode, useRealtimeAlerts, StatusBar, BottomNav, ElderlyShell, AlmaAlert
// Used by: app/app/layout.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-09
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: useMode for mode detection, shell components for layouts.
// useRealtimeAlerts for global alert display, AlmaAlert for rendering.

import { useMode } from '@/hooks/useMode'
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts'
import { StatusBar } from './StatusBar'
import { BottomNav } from './BottomNav'
import { ElderlyShell } from './ElderlyShell'
import { AlmaAlert } from '@/components/alma'

// ─── TYPES ────────────────────────────────────────────────

interface ShellProps {
  children: React.ReactNode
}

// ─── LOADING SKELETON ─────────────────────────────────────
// Why: Prevent layout shift while mode loads from DB.

function ShellSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Pulsing ALMA logo placeholder */}
      <div
        className="text-2xl font-bold animate-pulse"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--accent)',
          opacity: 0.5,
        }}
      >
        ALMA
      </div>
    </div>
  )
}

// ─── STANDARD SHELL ───────────────────────────────────────
// Why: StatusBar + Content + BottomNav layout for standard users.
// Includes realtime alert rendering with severity-based display.

function StandardShell({ children }: ShellProps) {
  const { urgentAlert, mediumAlerts, dismissAlert, snoozeAlert } = useRealtimeAlerts()

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Fixed top status bar */}
      <StatusBar />

      {/* URGENT: Full-screen overlay - highest z-index */}
      {urgentAlert && (
        <AlmaAlert
          alert={urgentAlert}
          variant="urgent"
          onDismiss={dismissAlert}
        />
      )}

      {/* MEDIUM: Top banner - below urgent, slides down from status bar */}
      {mediumAlerts[0] && !urgentAlert && (
        <AlmaAlert
          alert={mediumAlerts[0]}
          variant="medium"
          onDismiss={dismissAlert}
          onSnooze={snoozeAlert}
        />
      )}

      {/* Main content area — padded for fixed nav */}
      <main
        className="flex flex-col"
        style={{
          paddingTop: 'var(--status-bar-height)',
          paddingBottom: 'var(--bottom-nav-height)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>

      {/* Fixed bottom navigation */}
      <BottomNav />
    </div>
  )
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Wrapper that decides which shell to render based on mode.

/**
 * Main app shell wrapper that renders appropriate layout.
 * Standard mode: StatusBar + Content + BottomNav
 * Elderly mode: ElderlyShell with simplified navigation
 *
 * @param children - Page content to render inside shell
 * @returns Mode-appropriate shell layout
 */
export function Shell({ children }: ShellProps) {
  const { mode, isLoading } = useMode()

  // Show skeleton while loading mode
  // Why: Prevents flash of wrong layout
  if (isLoading) {
    return <ShellSkeleton />
  }

  // Render elderly shell for elderly mode
  if (mode === 'elderly') {
    return <ElderlyShell>{children}</ElderlyShell>
  }

  // Default: standard shell
  return <StandardShell>{children}</StandardShell>
}
