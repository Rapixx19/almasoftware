// ============================================================
// ALMA · API · alerts/[id]/route.ts
// ============================================================
// What this file does: PATCH and DELETE endpoints for single alert
// Module: alerts — see modules/alerts/README.md
// Depends on: lib/supabase/server.ts, lib/services/alert-service.ts
// Used by: hooks/useAlerts.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { dismissAlert, deleteAlert } from '@/lib/services/alert-service'

// ─── SCHEMAS ──────────────────────────────────────────────

const dismissAlertSchema = z.object({
  is_dismissed: z.literal(true),
})

// ─── TYPES ────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── PATCH HANDLER ────────────────────────────────────────

/**
 * Dismisses an alert (sets is_dismissed = true).
 * Rule 08 pattern: Zod → auth → user_id from session → dismiss → response.
 */
export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params

    const body = await request.json()
    const parseResult = dismissAlertSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const alert = await dismissAlert(user.id, id)

    return NextResponse.json({ alert })
  } catch (err) {
    console.error('PATCH /api/alerts/[id] error:', err)
    return NextResponse.json({ error: 'Failed to dismiss alert' }, { status: 500 })
  }
}

// ─── DELETE HANDLER ───────────────────────────────────────

/**
 * Deletes an alert.
 * Rule 08 pattern: auth → user_id from session → delete → response.
 */
export async function DELETE(_request: Request, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteAlert(user.id, id)

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/alerts/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
  }
}
