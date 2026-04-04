// ============================================================
// ALMA · API · tasks/route.ts
// ============================================================
// What this file does: GET and POST endpoints for tasks
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
import { createTask, getTasks, type TaskFilters } from '@/lib/services/task-service'
import type { TaskPriority } from '@/types/alma'

// ─── SCHEMAS ──────────────────────────────────────────────

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(500),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  due_date: z.string().nullable().optional(),
  source: z.enum(['chat', 'manual']).optional(),
})

const taskPriorityValues = ['low', 'normal', 'high'] as const

// ─── GET HANDLER ──────────────────────────────────────────

/**
 * Fetches user's tasks with optional filters.
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
    const priorityParam = searchParams.get('priority')
    const completedParam = searchParams.get('completed')

    const filters: TaskFilters = {}
    if (priorityParam && taskPriorityValues.includes(priorityParam as TaskPriority)) {
      filters.priority = priorityParam as TaskPriority
    }
    if (completedParam !== null) {
      filters.is_completed = completedParam === 'true'
    }

    const tasks = await getTasks(user.id, filters)

    return NextResponse.json({ tasks })
  } catch (err) {
    console.error('GET /api/tasks error:', err)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// ─── POST HANDLER ─────────────────────────────────────────

/**
 * Creates a new task for the user.
 * Rule 08 pattern: Zod → auth → user_id from session → create → response.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const parseResult = createTaskSchema.safeParse(body)

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

    const task = await createTask(user.id, parseResult.data)

    return NextResponse.json({ task }, { status: 201 })
  } catch (err) {
    console.error('POST /api/tasks error:', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
