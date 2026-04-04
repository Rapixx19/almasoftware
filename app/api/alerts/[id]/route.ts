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
import { dismissAlert, deleteAlert, snoozeAlert } from '@/lib/services/alert-service'

// ─── SCHEMAS ──────────────────────────────────────────────

const updateAlertSchema = z.object({
  is_dismissed: z.boolean().optional(),
  action: z.enum(['dismiss', 'snooze']).optional(),
  snooze_minutes: z.number().int().min(1).max(1440).optional(),
}).refine(
  (data) => {
    // If action is snooze, snooze_minutes must be provided
    if (data.action === 'snooze' && !data.snooze_minutes) return false
    // Either is_dismissed or action must be provided
    return data.is_dismissed !== undefined || data.action !== undefined
  },
  { message: 'Either is_dismissed or action must be provided. Snooze requires snooze_minutes.' }
)

// ─── TYPES ────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── PATCH HANDLER ────────────────────────────────────────

/**
 * Updates an alert (dismiss or snooze).
 * Rule 08 pattern: Zod → auth → user_id from session → action → response.
 */
export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params

    const body = await request.json()
    const parseResult = updateAlertSchema.safeParse(body)

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

    const { is_dismissed, action, snooze_minutes } = parseResult.data

    // Handle snooze action
    if (action === 'snooze' && snooze_minutes) {
      const alert = await snoozeAlert(user.id, id, snooze_minutes)
      return NextResponse.json({ alert })
    }

    // Handle dismiss (via action or is_dismissed flag)
    if (action === 'dismiss' || is_dismissed) {
      const alert = await dismissAlert(user.id, id)
      return NextResponse.json({ alert })
    }

    return NextResponse.json({ error: 'No valid action specified' }, { status: 400 })
  } catch (err) {
    console.error('PATCH /api/alerts/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
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
