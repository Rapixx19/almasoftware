// ============================================================
// ALMA · SERVICES · memory-service.ts
// ============================================================
// What this file does: Server-side memory CRUD operations
// Module: memory — see modules/memory/README.md
// Depends on: lib/supabase/server.ts, types/alma.ts
// Used by: app/api/memories/route.ts, app/api/memories/[id]/route.ts
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

import { createClient } from '@/lib/supabase/server'
import type { AlmaMemory, MemoryCategory } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export interface CreateMemoryInput {
  content: string
  category: MemoryCategory
  source?: 'chat' | 'manual' | undefined
  importance?: number | undefined
}

export interface UpdateMemoryInput {
  content?: string | undefined
  category?: MemoryCategory | undefined
  importance?: number | undefined
}

export interface MemoryFilters {
  category?: MemoryCategory
  limit?: number
}

interface MemoryRow {
  id: string
  user_id: string
  content: string
  memory_type: string | null
  created_at: string | null
  updated_at: string | null
}

// ─── HELPERS ──────────────────────────────────────────────

function toAlmaMemory(row: MemoryRow): AlmaMemory {
  return {
    id: row.id,
    user_id: row.user_id,
    category: (row.memory_type as MemoryCategory) || 'other',
    content: row.content,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────

/** Creates a new memory. userId from session (Rule 13). */
export async function createMemory(userId: string, data: CreateMemoryInput): Promise<AlmaMemory> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('alma_memory')
    .insert({
      user_id: userId,
      content: data.content,
      memory_type: data.category,
      source: data.source || 'manual',
      importance: data.importance ?? 0.5,
    })
    .select()
    .single()
  if (error) throw new Error(`Failed to create memory: ${error.message}`)
  return toAlmaMemory(row)
}

/** Fetches memories with optional filters. userId from session (Rule 13). */
export async function getMemories(userId: string, filters?: MemoryFilters): Promise<AlmaMemory[]> {
  const supabase = await createClient()
  let query = supabase.from('alma_memory').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (filters?.category) query = query.eq('memory_type', filters.category)
  if (filters?.limit) query = query.limit(filters.limit)
  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch memories: ${error.message}`)
  return (data || []).map(toAlmaMemory)
}

/** Updates an existing memory. userId from session (Rule 13). */
export async function updateMemory(userId: string, id: string, data: UpdateMemoryInput): Promise<AlmaMemory> {
  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (data.content !== undefined) updateData.content = data.content
  if (data.category !== undefined) updateData.memory_type = data.category
  if (data.importance !== undefined) updateData.importance = data.importance
  const { data: row, error } = await supabase
    .from('alma_memory')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw new Error(`Failed to update memory: ${error.message}`)
  return toAlmaMemory(row)
}

/** Deletes a memory. userId from session (Rule 13). */
export async function deleteMemory(userId: string, id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('alma_memory').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(`Failed to delete memory: ${error.message}`)
}

/** Fetches top memories by importance for context injection. */
export async function getRelevantMemories(userId: string, limit = 5): Promise<AlmaMemory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('alma_memory')
    .select('*')
    .eq('user_id', userId)
    .order('importance', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`Failed to fetch memories: ${error.message}`)
  return (data || []).map(toAlmaMemory)
}
