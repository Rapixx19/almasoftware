// ============================================================
// ALMA · APP · app/page.tsx
// ============================================================
// What this file does: Chat home page with full ChatView integration
// Module: chat — see modules/chat/README.md
// Depends on: lib/supabase/server.ts, components/chat
// Used by: Authenticated users via Shell layout
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for auth check, redirect for protection, ChatView for UI.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatView } from '@/components/chat'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Server component checks auth, then renders client ChatView.

/**
 * Chat page for authenticated users.
 * Verifies auth on server, redirects to login if needed.
 *
 * @returns ChatView component for chat interface
 */
export default async function ChatPage() {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Render chat interface
  // Why: ChatView is a client component that handles all chat state
  return <ChatView />
}
