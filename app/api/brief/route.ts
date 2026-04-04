// ============================================================
// ALMA · API · brief/route.ts
// ============================================================
// What this file does: Generates personalized morning brief for the user
// Module: agents — AI agents for proactive intelligence
// Depends on: lib/supabase/server.ts, lib/agents/morning-brief.ts
// Used by: Home page, Morning Brief card
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMorningBriefWithCache } from '@/lib/agents/morning-brief'

// ─── HANDLER ──────────────────────────────────────────────

/**
 * Generates a personalized morning brief for the authenticated user.
 * Uses hybrid caching: generates on first home visit of the day.
 *
 * @param request - Request object
 * @returns JSON with morning brief data
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Step 1: Auth check (Rule 08)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 2: Generate or fetch cached brief
    const brief = await getMorningBriefWithCache(supabase, user.id)

    // Step 3: Return brief
    return NextResponse.json({ brief })
  } catch (err) {
    console.error('Brief API error:', err)
    return NextResponse.json(
      { error: 'Failed to generate brief' },
      { status: 500 }
    )
  }
}

/**
 * Force regenerate the morning brief (ignores cache).
 * Useful for refresh button or testing.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Import and call generateMorningBrief directly (bypasses cache)
    const { generateMorningBrief } = await import('@/lib/agents/morning-brief')
    const brief = await generateMorningBrief(supabase, user.id)

    return NextResponse.json({ brief })
  } catch (err) {
    console.error('Brief regeneration error:', err)
    return NextResponse.json(
      { error: 'Failed to regenerate brief' },
      { status: 500 }
    )
  }
}
