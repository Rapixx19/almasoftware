// ============================================================
// ALMA · API · alerts/route.ts
// ============================================================
// What this file does: GET and POST endpoints for alerts
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
import { createAlert, getAlerts, type AlertFilters } from '@/lib/services/alert-service'
import type { AlertSeverity } from '@/types/alma'

// ─── SCHEMAS ──────────────────────────────────────────────

const createAlertSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(500),
  body: z.string().max(2000).optional(),
  severity: z.enum(['low', 'medium', 'urgent']).optional(),
  alert_type: z.enum(['reminder', 'task_due', 'calendar', 'system', 'chat']).optional(),
})

const severityValues = ['low', 'medium', 'urgent'] as const

// ─── GET HANDLER ──────────────────────────────────────────

/**
 * Fetches user's alerts with optional filters.
 * Rule 08 pattern: auth check → user_id from session → fetch → response.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const severityParam = searchParams.get('severity')
    const dismissedParam = searchParams.get('dismissed')

    const filters: AlertFilters = {}
    if (severityParam && severityValues.includes(severityParam as AlertSeverity)) {
      filters.severity = severityParam as AlertSeverity
    }
    if (dismissedParam !== null) {
      filters.is_dismissed = dismissedParam === 'true'
    }

    const alerts = await getAlerts(user.id, filters)

    return NextResponse.json({ alerts })
  } catch (err) {
    console.error('GET /api/alerts error:', err)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

// ─── POST HANDLER ─────────────────────────────────────────

/**
 * Creates a new alert for the user.
 * Rule 08 pattern: Zod → auth → user_id from session → create → response.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parseResult = createAlertSchema.safeParse(body)

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

    const alert = await createAlert(user.id, parseResult.data)

    return NextResponse.json({ alert }, { status: 201 })
  } catch (err) {
    console.error('POST /api/alerts error:', err)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
