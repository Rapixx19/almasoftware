// ============================================================
// ALMA · APP · medications/page.tsx
// ============================================================
// What this file does: Medications page placeholder (elderly mode)
// Module: elderly — see modules/elderly/README.md
// Depends on: nothing (placeholder)
// Used by: ElderlyShell navigation
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Pill icon for medications visual.

import { Pill } from 'lucide-react'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Placeholder for elderly mode medication tracking.

/**
 * Medications page placeholder for elderly mode.
 * Will show medication schedules, reminders, and history.
 *
 * @returns Placeholder medications page
 */
export default function MedicationsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Pill
          size={48}
          style={{ color: 'var(--gold)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Medications
      </h1>

      <p
        className="text-center max-w-xs"
        style={{
          color: 'var(--text-secondary)',
          // Larger text for elderly mode accessibility
          fontSize: '18px',
        }}
      >
        Your medication schedule and reminders will appear here. Coming soon.
      </p>
    </div>
  )
}
