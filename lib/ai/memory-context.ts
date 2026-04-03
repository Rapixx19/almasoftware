// ============================================================
// ALMA · LIB · memory-context.ts
// ============================================================
// What this file does: Formats memories for chat context injection
// Module: memory — see modules/memory/README.md
// Depends on: lib/supabase/server.ts
// Used by: app/api/chat/route.ts
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Server client for authenticated database access.

import { createClient } from '@/lib/supabase/server'

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Limit memory count to manage token usage.

const MAX_MEMORIES = 5

// ─── FUNCTIONS ────────────────────────────────────────────

/**
 * Fetches relevant memories and formats them for system prompt injection.
 * Returns empty string if no memories exist.
 *
 * @param userId - User ID from session
 * @returns Formatted memory context string
 * @example
 * const context = await getMemoryContext(userId)
 * // Returns: "\n\nUser Memories:\n- [preference] Prefers morning calls\n..."
 */
export async function getMemoryContext(userId: string): Promise<string> {
  const supabase = await createClient()

  // Fetch top memories ordered by importance
  const { data, error } = await supabase
    .from('alma_memory')
    .select('content, memory_type')
    .eq('user_id', userId)
    .order('importance', { ascending: false })
    .limit(MAX_MEMORIES)

  if (error) {
    // Log but don't throw — memories are optional context
    console.error('Failed to fetch memory context:', error)
    return ''
  }

  if (!data?.length) return ''

  // Format memories as bullet list with category tags
  const memoryLines = data.map(
    (m) => `- [${m.memory_type || 'other'}] ${m.content}`
  )

  return `\n\nUser Memories (use these to personalize your responses):\n${memoryLines.join('\n')}`
}
