// ============================================================
// ALMA · API · memories/route.ts
// ============================================================
// What this file does: GET and POST endpoints for memories
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
import {
  createMemory,
  getMemories,
  type MemoryFilters,
} from '@/lib/services/memory-service'
import type { MemoryCategory } from '@/types/alma'

// ─── SCHEMAS ──────────────────────────────────────────────
// Why: Rule 08 — Zod validation on all API request bodies.

const createMemorySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(2000),
  category: z.enum([
    'preference',
    'fact',
    'relationship',
    'routine',
    'health',
    'other',
  ]),
  source: z.enum(['chat', 'manual']).optional(),
  importance: z.number().min(0).max(1).optional(),
})

const memoryCategoryValues = [
  'preference',
  'fact',
  'relationship',
  'routine',
  'health',
  'other',
] as const

// ─── GET HANDLER ──────────────────────────────────────────

/**
 * Fetches user's memories with optional category filter.
 * Rule 08 pattern: auth check → user_id from session → fetch → response.
 *
 * @param request - Request with optional category query param
 * @returns JSON with memories array
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Step 1: Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 2: Parse query params
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')

    const filters: MemoryFilters = {}
    if (categoryParam && memoryCategoryValues.includes(categoryParam as MemoryCategory)) {
      filters.category = categoryParam as MemoryCategory
    }

    // Step 3: Fetch memories (user_id from session — Rule 13)
    const memories = await getMemories(user.id, filters)

    return NextResponse.json({ memories })
  } catch (err) {
    console.error('GET /api/memories error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}

// ─── POST HANDLER ─────────────────────────────────────────

/**
 * Creates a new memory for the user.
 * Rule 08 pattern: Zod → auth → user_id from session → create → response.
 *
 * @param request - Request with JSON body containing content and category
 * @returns JSON with created memory
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Step 1: Zod validation
    const body = await request.json()
    const parseResult = createMemorySchema.safeParse(body)

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

    // Step 3: Create memory (user_id from session — Rule 13)
    const memory = await createMemory(user.id, parseResult.data)

    return NextResponse.json({ memory }, { status: 201 })
  } catch (err) {
    console.error('POST /api/memories error:', err)
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    )
  }
}
