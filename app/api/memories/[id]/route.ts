// ============================================================
// ALMA · API · memories/[id]/route.ts
// ============================================================
// What this file does: PATCH and DELETE endpoints for single memory
// Module: memory — see modules/memory/README.md
// Depends on: lib/supabase/server.ts, lib/services/memory-service.ts
// Used by: hooks/useMemories.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Zod for validation, server client for RLS, service for business logic.

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { updateMemory, deleteMemory } from '@/lib/services/memory-service'

// ─── SCHEMAS ──────────────────────────────────────────────
// Why: Rule 08 — Zod validation on all API request bodies.

const updateMemorySchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  category: z
    .enum(['preference', 'fact', 'relationship', 'routine', 'health', 'other'])
    .optional(),
  importance: z.number().min(0).max(1).optional(),
})

// ─── TYPES ────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── PATCH HANDLER ────────────────────────────────────────

/**
 * Updates an existing memory.
 * Rule 08 pattern: Zod → auth → user_id from session → update → response.
 *
 * @param request - Request with JSON body containing updates
 * @param context - Route context with memory ID
 * @returns JSON with updated memory
 */
export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    // Step 1: Zod validation
    const body = await request.json()
    const parseResult = updateMemorySchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    // Step 2: Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 3: Update memory (user_id from session — Rule 13)
    const memory = await updateMemory(user.id, id, parseResult.data)

    return NextResponse.json({ memory })
  } catch (err) {
    console.error('PATCH /api/memories/[id] error:', err)
    return NextResponse.json(
      { error: 'Failed to update memory' },
      { status: 500 }
    )
  }
}

// ─── DELETE HANDLER ───────────────────────────────────────

/**
 * Deletes a memory.
 * Rule 08 pattern: auth → user_id from session → delete → response.
 *
 * @param _request - Request (unused)
 * @param context - Route context with memory ID
 * @returns 204 No Content on success
 */
export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    // Step 1: Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 2: Delete memory (user_id from session — Rule 13)
    await deleteMemory(user.id, id)

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/memories/[id] error:', err)
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    )
  }
}
