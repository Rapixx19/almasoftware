// ============================================================
// ALMA · API · tasks/[id]/route.ts
// ============================================================
// What this file does: PATCH and DELETE endpoints for single task
// Module: tasks — see modules/tasks/README.md
// Depends on: lib/supabase/server.ts, lib/services/task-service.ts
// Used by: hooks/useTasks.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { updateTask, deleteTask, toggleTaskComplete } from '@/lib/services/task-service'

// ─── SCHEMAS ──────────────────────────────────────────────

const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  due_date: z.string().nullable().optional(),
  is_completed: z.boolean().optional(),
  toggle_complete: z.boolean().optional(),
})

// ─── TYPES ────────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── PATCH HANDLER ────────────────────────────────────────

/**
 * Updates an existing task.
 * Supports toggle_complete for checkbox actions.
 * Rule 08 pattern: Zod → auth → user_id from session → update → response.
 */
export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params

    const body = await request.json()
    const parseResult = updateTaskSchema.safeParse(body)

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

    let task
    if (parseResult.data.toggle_complete) {
      task = await toggleTaskComplete(user.id, id)
    } else {
      const { toggle_complete: _, ...updateData } = parseResult.data
      task = await updateTask(user.id, id, updateData)
    }

    return NextResponse.json({ task })
  } catch (err) {
    console.error('PATCH /api/tasks/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// ─── DELETE HANDLER ───────────────────────────────────────

/**
 * Deletes a task.
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

    await deleteTask(user.id, id)

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /api/tasks/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
