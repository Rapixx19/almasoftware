// ============================================================
// ALMA · APP · (auth)/layout.tsx
// ============================================================
// What this file does: Shared layout for auth pages (login, signup)
// Module: auth — see modules/auth/README.md
// Depends on: nothing — layout wrapper only
// Used by: /login, /signup pages
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── TYPES ────────────────────────────────────────────────

interface AuthLayoutProps {
  children: React.ReactNode
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Shared dark background and centering for auth pages.
// No 'use client' needed — pure layout with no hooks.

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {children}
    </div>
  )
}
