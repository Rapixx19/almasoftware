// ============================================================
// ALMA · COMPONENTS · HomeHubStrip.tsx
// ============================================================
// What this file does: Hub online/offline indicator strip
// Module: screens — Home screen components
// Depends on: nothing
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── TYPES ────────────────────────────────────────────────

interface HomeHubStripProps {
  isOnline: boolean
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Hub status indicator showing online/offline state.
 * Cyan dot when online, muted when offline.
 *
 * @param isOnline - Hub connection status
 * @returns Hub status strip component
 */
export function HomeHubStrip({ isOnline }: HomeHubStripProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: isOnline ? 'var(--accent)' : 'var(--text-muted)',
          boxShadow: isOnline ? '0 0 6px var(--accent)' : 'none',
        }}
      />
      <span
        className="text-xs"
        style={{
          color: isOnline ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Hub {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}
