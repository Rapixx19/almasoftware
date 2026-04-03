// ============================================================
// ALMA · APP · app/LogoutButton.tsx
// ============================================================
// What this file does: Client-side logout button component
// Module: auth — see modules/auth/README.md
// Depends on: hooks/useAuth.ts
// Used by: app/app/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: useAuth for logout action, useRouter for navigation.

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Client component required for logout action.

export function LogoutButton() {
  const router = useRouter()
  const { logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-6 py-2 rounded font-medium text-sm transition-opacity"
      style={{
        backgroundColor: 'var(--bg-dim)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
