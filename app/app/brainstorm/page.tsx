// ============================================================
// ALMA · APP · brainstorm/page.tsx
// ============================================================
// What this file does: Brainstorm/Ideas page placeholder
// Module: workspace — see modules/workspace/README.md
// Depends on: nothing (placeholder)
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Lightbulb icon for ideas/brainstorm visual.

import { Lightbulb } from 'lucide-react'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Placeholder until brainstorm feature implementation.

/**
 * Brainstorm/Ideas page placeholder.
 * Will allow capturing and organizing ideas with Alma's help.
 *
 * @returns Placeholder brainstorm page
 */
export default function BrainstormPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Lightbulb
          size={48}
          style={{ color: 'var(--purple)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Ideas
      </h1>

      <p
        className="text-center max-w-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        Capture and explore ideas with Alma. Coming soon.
      </p>
    </div>
  )
}
