// ============================================================
// ALMA · SERVICES · task-service.ts
// ============================================================
// What this file does: Server-side task CRUD operations
// Module: tasks — see modules/tasks/README.md
// Depends on: lib/supabase/server.ts, types/alma.ts
// Used by: app/api/tasks/route.ts, app/api/tasks/[id]/route.ts
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

import { createClient } from '@/lib/supabase/server'
import type { AlmaTask, TaskPriority } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export interface CreateTaskInput {
  title: string
  priority?: TaskPriority | undefined
  due_date?: string | null | undefined
  source?: 'chat' | 'manual' | undefined
}

export interface UpdateTaskInput {
  title?: string | undefined
  priority?: TaskPriority | undefined
  due_date?: string | null | undefined
  is_completed?: boolean | undefined
}

export interface TaskFilters {
  priority?: TaskPriority
  is_completed?: boolean
  limit?: number
}

interface TaskRow {
  id: string
  user_id: string
  title: string
  priority: string | null
  status: string | null
  completed_at: string | null
  due_date: string | null
  created_at: string | null
  updated_at: string | null
}

// ─── HELPERS ──────────────────────────────────────────────

function toAlmaTask(row: TaskRow): AlmaTask {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    priority: (row.priority as TaskPriority) || 'normal',
    is_completed: row.status === 'completed',
    due_date: row.due_date,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────

/** Creates a new task. userId from session (Rule 13). */
export async function createTask(userId: string, data: CreateTaskInput): Promise<AlmaTask> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('alma_tasks')
    .insert({
      user_id: userId,
      title: data.title,
      priority: data.priority || 'normal',
      status: 'pending',
      due_date: data.due_date || null,
      source: data.source || 'manual',
    })
    .select()
    .single()
  if (error) throw new Error(`Failed to create task: ${error.message}`)
  return toAlmaTask(row)
}

/** Fetches tasks with optional filters. userId from session (Rule 13). */
export async function getTasks(userId: string, filters?: TaskFilters): Promise<AlmaTask[]> {
  const supabase = await createClient()
  let query = supabase.from('alma_tasks').select('*').eq('user_id', userId)
  if (filters?.priority) query = query.eq('priority', filters.priority)
  if (filters?.is_completed !== undefined) {
    query = query.eq('status', filters.is_completed ? 'completed' : 'pending')
  }
  query = query.order('status', { ascending: true }).order('due_date', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false })
  if (filters?.limit) query = query.limit(filters.limit)
  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch tasks: ${error.message}`)
  return (data || []).map(toAlmaTask)
}

/** Updates an existing task. userId from session (Rule 13). */
export async function updateTask(userId: string, id: string, data: UpdateTaskInput): Promise<AlmaTask> {
  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.priority !== undefined) updateData.priority = data.priority
  if (data.due_date !== undefined) updateData.due_date = data.due_date
  if (data.is_completed !== undefined) {
    updateData.status = data.is_completed ? 'completed' : 'pending'
    updateData.completed_at = data.is_completed ? new Date().toISOString() : null
  }
  const { data: row, error } = await supabase
    .from('alma_tasks')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw new Error(`Failed to update task: ${error.message}`)
  return toAlmaTask(row)
}

/** Deletes a task. userId from session (Rule 13). */
export async function deleteTask(userId: string, id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('alma_tasks').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(`Failed to delete task: ${error.message}`)
}

/** Toggles task completion status. userId from session (Rule 13). */
export async function toggleTaskComplete(userId: string, id: string): Promise<AlmaTask> {
  const supabase = await createClient()
  const { data: current, error: fetchError } = await supabase.from('alma_tasks').select('status').eq('id', id).eq('user_id', userId).single()
  if (fetchError) throw new Error(`Failed to fetch task: ${fetchError.message}`)
  const isCompleted = current.status === 'completed'
  const { data: row, error } = await supabase.from('alma_tasks')
    .update({ status: isCompleted ? 'pending' : 'completed', completed_at: isCompleted ? null : new Date().toISOString() })
    .eq('id', id).eq('user_id', userId).select().single()
  if (error) throw new Error(`Failed to toggle task: ${error.message}`)
  return toAlmaTask(row)
}
