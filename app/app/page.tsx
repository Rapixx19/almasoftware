// ============================================================
// ALMA · APP · app/page.tsx
// ============================================================
// What this file does: Chat home page for authenticated users
// Module: chat — see modules/chat/README.md
// Depends on: lib/supabase/server.ts
// Used by: Authenticated users via Shell layout
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for user data, redirect for auth protection.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessageCircle } from 'lucide-react'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Chat page placeholder. Full implementation in Phase 3.

export default async function ChatPage() {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for welcome message
  type ProfileRow = {
    display_name: string
  }

  const { data } = await supabase
    .from('users_profile')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const profile = data as ProfileRow | null
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'there'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      {/* Chat icon */}
      <div
        className="p-6 rounded-full mb-6"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <MessageCircle
          size={48}
          style={{ color: 'var(--accent)' }}
        />
      </div>

      {/* Welcome heading */}
      <h1
        className="text-2xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Hello, {displayName}
      </h1>

      {/* Placeholder message */}
      <p
        className="text-center max-w-xs mb-6"
        style={{ color: 'var(--text-secondary)' }}
      >
        Chat with Alma coming soon. The shell is ready for Phase 3.
      </p>

      {/* Status indicator */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
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
          Connected
        </span>
      </div>
    </div>
  )
}
