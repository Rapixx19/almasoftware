// ============================================================
// ALMA · APP · settings/page.tsx
// ============================================================
// What this file does: Settings page placeholder
// Module: shell — see modules/shell/README.md
// Depends on: nothing (placeholder)
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Settings icon and LogoutButton for account actions.

import { Settings } from 'lucide-react'
import { LogoutButton } from '../LogoutButton'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Placeholder with logout until full settings implementation.

/**
 * Settings page placeholder.
 * Currently shows logout. Will include profile, preferences, integrations.
 *
 * @returns Placeholder settings page with logout
 */
export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Settings
          size={48}
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Settings
      </h1>

      <p
        className="text-center max-w-xs mb-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        Account settings and preferences. Coming soon.
      </p>

      {/* Logout available now */}
      <LogoutButton />
    </div>
  )
}
