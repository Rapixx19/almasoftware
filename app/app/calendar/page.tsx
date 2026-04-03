// ============================================================
// ALMA · APP · calendar/page.tsx
// ============================================================
// What this file does: Calendar page placeholder
// Module: calendar — see modules/calendar/README.md
// Depends on: nothing (placeholder)
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Calendar icon for visual consistency.

import { Calendar } from 'lucide-react'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Placeholder until Phase 4 (Calendar integration).

/**
 * Calendar page placeholder.
 * Will display synced calendar events and allow event creation.
 *
 * @returns Placeholder calendar page
 */
export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Calendar
          size={48}
          style={{ color: 'var(--accent)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Calendar
      </h1>

      <p
        className="text-center max-w-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        Your calendar events will appear here. Coming soon.
      </p>
    </div>
  )
}
