// ============================================================
// ALMA · APP · page.tsx
// ============================================================
// What this file does: Root page that redirects based on auth status
// Module: auth — see modules/auth/README.md
// Depends on: lib/supabase/server.ts
// Used by: Users visiting /
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for session check, redirect for navigation.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Server component checks auth and redirects immediately.
// No UI needed — this is a routing page only.

export default async function HomePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect based on auth status
  if (user) {
    redirect('/app')
  } else {
    redirect('/login')
  }
}
