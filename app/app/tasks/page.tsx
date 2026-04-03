// ============================================================
// ALMA · APP · tasks/page.tsx
// ============================================================
// What this file does: Tasks page placeholder
// Module: tasks — see modules/tasks/README.md
// Depends on: nothing (placeholder)
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: CheckSquare icon for tasks visual.

import { CheckSquare } from 'lucide-react'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Placeholder until tasks feature implementation.

/**
 * Tasks page placeholder.
 * Will display tasks extracted from conversations and manually added.
 *
 * @returns Placeholder tasks page
 */
export default function TasksPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <CheckSquare
          size={48}
          style={{ color: 'var(--success)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Tasks
      </h1>

      <p
        className="text-center max-w-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        Your tasks and to-dos will appear here. Coming soon.
      </p>
    </div>
  )
}
