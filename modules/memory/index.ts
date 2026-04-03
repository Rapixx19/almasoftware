// ============================================================
// ALMA · MODULES · memory/index.ts
// ============================================================
// What this file does: Public exports for the Memory module
// Module: memory — see README.md
// Depends on: various memory module files
// Used by: External consumers of the memory module
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

// ─── SERVICE EXPORTS ─────────────────────────────────────
// Why: Server-side memory operations for API routes.

export {
  createMemory,
  getMemories,
  updateMemory,
  deleteMemory,
  getRelevantMemories,
  type CreateMemoryInput,
  type UpdateMemoryInput,
  type MemoryFilters,
} from '@/lib/services/memory-service'

// ─── HOOK EXPORTS ────────────────────────────────────────
// Why: Client-side memory management with realtime updates.

export { useMemories } from '@/hooks/useMemories'

// ─── COMPONENT EXPORTS ───────────────────────────────────
// Why: UI components for memory display and management.

export { MemoryCard, MemoryList, MemoryForm } from '@/components/memory'

// ─── CONTEXT EXPORTS ─────────────────────────────────────
// Why: Chat integration for memory context injection.

export { getMemoryContext } from '@/lib/ai/memory-context'
