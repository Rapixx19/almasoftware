// ============================================================
// ALMA · API · validate-invite/route.ts
// ============================================================
// What this file does: Validates invite codes for gated signup
// Module: auth — see modules/auth/README.md
// Depends on: lib/supabase/server.ts, zod
// Used by: Signup page before account creation
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Zod for request validation, server client for DB access.

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// ─── SCHEMA ───────────────────────────────────────────────
// Why: Zod validation ensures request body is well-formed.
// Rule 08: API route pattern — Zod parse first.

const validateInviteSchema = z.object({
  code: z.string().min(1, 'Invite code is required').max(50),
})

// ─── HANDLER ──────────────────────────────────────────────
// Why: POST handler validates invite code exists and has uses remaining.

/**
 * Validates an invite code before signup.
 * Returns 200 if valid, 400 if invalid or expired.
 *
 * @param request - Request with JSON body containing code
 * @returns JSON response with validation result
 * @throws Never throws — errors return appropriate HTTP status
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Step 1: Parse and validate request body (Rule 08)
    const body = await request.json()
    const parseResult = validateInviteSchema.safeParse(body)

    if (!parseResult.success) {
      // Zod v4 uses .issues instead of .errors
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const { code } = parseResult.data

    // Step 2: Check invite code in database
    // Note: This route doesn't require auth — it's called before signup.
    // RLS policy allows reading valid codes.
    const supabase = await createClient()

    // Type the query result explicitly for TypeScript
    type InviteCodeRow = {
      id: string
      code: string
      uses_remaining: number | null
      expires_at: string | null
    }

    const { data, error: dbError } = await supabase
      .from('invite_codes')
      .select('id, code, uses_remaining, expires_at')
      .eq('code', code.toUpperCase())
      .single()

    const inviteCode = data as InviteCodeRow | null

    if (dbError || !inviteCode) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      )
    }

    // Step 3: Validate code is still usable
    if (inviteCode.uses_remaining !== null && inviteCode.uses_remaining <= 0) {
      return NextResponse.json(
        { error: 'This invite code has been fully used' },
        { status: 400 }
      )
    }

    if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This invite code has expired' },
        { status: 400 }
      )
    }

    // Step 4: Code is valid
    return NextResponse.json(
      { valid: true, code: inviteCode.code },
      { status: 200 }
    )
  } catch {
    // Step 5: Catch-all error handler (Rule 08)
    // Generic message — never expose internals
    return NextResponse.json(
      { error: 'Failed to validate invite code' },
      { status: 500 }
    )
  }
}
