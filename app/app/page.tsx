// ============================================================
// ALMA · APP · app/page.tsx
// ============================================================
// What this file does: Main app page for authenticated users
// Module: shell — see modules/shell/README.md
// Depends on: lib/supabase/server.ts
// Used by: Authenticated users
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for user data, redirect for auth protection.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './LogoutButton'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Server component fetches user data. Placeholder until Phase 2.

export default async function AppPage() {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  // Type the query result explicitly for TypeScript
  type ProfileRow = {
    display_name: string
    onboarding_complete: boolean | null
  }

  const { data } = await supabase
    .from('users_profile')
    .select('display_name, onboarding_complete')
    .eq('id', user.id)
    .single()

  const profile = data as ProfileRow | null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-lg text-center"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Logo */}
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--accent)',
          }}
        >
          ALMA
        </h1>

        {/* Welcome message */}
        <p
          className="text-lg mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome, {profile?.display_name || user.email}
        </p>
        <p
          className="text-sm mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          Authentication successful. App shell coming in Phase 2.
        </p>

        {/* Status indicator */}
        <div
          className="flex items-center justify-center gap-2 mb-6 p-3 rounded"
          style={{ backgroundColor: 'var(--bg-dim)' }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--success)' }}
          />
          <span
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Authenticated
          </span>
        </div>

        {/* Logout button */}
        <LogoutButton />
      </div>
    </div>
  )
}
