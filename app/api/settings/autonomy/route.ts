// ============================================================
// ALMA · API · settings/autonomy/route.ts
// ============================================================
// What this file does: GET and PATCH endpoints for autonomy settings
// Module: settings — user autonomy preferences
// Depends on: lib/supabase/server.ts, lib/services/settings-service.ts
// Used by: hooks/useSettings.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  getAutonomySettings,
  updateAutonomySetting,
} from '@/lib/services/settings-service'

// ─── SCHEMAS ──────────────────────────────────────────────

const updateAutonomySchema = z.object({
  key: z.enum(['messages', 'calendar', 'smart_home']),
  value: z.number().int().min(0).max(100),
})

// ─── GET HANDLER ──────────────────────────────────────────

/**
 * Fetches user's autonomy settings.
 * Returns default values if not set.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await getAutonomySettings(user.id)

    return NextResponse.json({ settings })
  } catch (err) {
    console.error('GET /api/settings/autonomy error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch autonomy settings' },
      { status: 500 }
    )
  }
}

// ─── PATCH HANDLER ────────────────────────────────────────

/**
 * Updates a single autonomy setting.
 * Validates key against allowlist and value range.
 */
export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parseResult = updateAutonomySchema.safeParse(body)

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

    const { key, value } = parseResult.data
    const settings = await updateAutonomySetting(user.id, key, value)

    return NextResponse.json({ settings })
  } catch (err) {
    console.error('PATCH /api/settings/autonomy error:', err)
    return NextResponse.json(
      { error: 'Failed to update autonomy settings' },
      { status: 500 }
    )
  }
}
