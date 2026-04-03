// ============================================================
// ALMA · APP · memories/page.tsx
// ============================================================
// What this file does: Memory management page
// Module: memory — see modules/memory/README.md
// Depends on: hooks/useMemories.ts, components/memory/*
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import { useMemories } from '@/hooks/useMemories'
import { MemoryList, MemoryForm } from '@/components/memory'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Memory management page.
 * Displays list of memories with filter and add functionality.
 */
export default function MemoriesPage() {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [showForm, setShowForm] = useState(false)

  const {
    memories,
    isLoading,
    error,
    createMemory,
    updateMemory,
    deleteMemory,
    filterCategory,
    setFilterCategory,
  } = useMemories()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-bold"
          style={{
            fontSize: isElderly ? '28px' : '24px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          Memories
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          <Plus size={isElderly ? 22 : 18} />
          <span style={{ fontSize: isElderly ? '16px' : '14px' }}>Add</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div
          className="p-3 rounded-lg mb-4"
          style={{
            backgroundColor: 'var(--error)',
            color: 'white',
          }}
        >
          {error.message}
        </div>
      )}

      {/* Memory list */}
      <MemoryList
        memories={memories}
        isLoading={isLoading}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        onUpdate={updateMemory}
        onDelete={deleteMemory}
      />

      {/* Add memory form modal */}
      {showForm && (
        <MemoryForm
          onSubmit={createMemory}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
