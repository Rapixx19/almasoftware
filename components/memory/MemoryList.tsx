// ============================================================
// ALMA · COMPONENTS · MemoryList.tsx
// ============================================================
// What this file does: Renders list of memories with filter tabs
// Module: memory — see modules/memory/README.md
// Depends on: components/memory/MemoryCard.tsx, hooks/useMode.ts
// Used by: app/app/memories/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { Brain } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaMemory, MemoryCategory } from '@/types/alma'
import MemoryCard from './MemoryCard'

// ─── TYPES ────────────────────────────────────────────────

interface MemoryListProps {
  memories: AlmaMemory[]
  isLoading: boolean
  filterCategory: MemoryCategory | null
  onFilterChange: (category: MemoryCategory | null) => void
  onUpdate: (id: string, updates: { content?: string; category?: MemoryCategory }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const CATEGORIES: { value: MemoryCategory | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'preference', label: 'Preferences' },
  { value: 'fact', label: 'Facts' },
  { value: 'relationship', label: 'Relationships' },
  { value: 'routine', label: 'Routines' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
]

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Renders a filterable list of memories.
 * Handles loading, empty, and populated states (Rule 09).
 */
export default function MemoryList({
  memories,
  isLoading,
  filterCategory,
  onFilterChange,
  onUpdate,
  onDelete,
}: MemoryListProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const fontSize = isElderly ? '16px' : '14px'

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="animate-pulse"
          style={{ color: 'var(--text-secondary)' }}
        >
          Loading memories...
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value ?? 'all'}
            onClick={() => onFilterChange(cat.value)}
            className="px-3 py-2 rounded-full whitespace-nowrap transition-colors"
            style={{
              fontSize,
              backgroundColor:
                filterCategory === cat.value ? 'var(--accent)' : 'var(--bg-surface)',
              color:
                filterCategory === cat.value
                  ? 'var(--text-on-accent)'
                  : 'var(--text-secondary)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Memory list or empty state */}
      {memories.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className="p-4 rounded-full mb-4"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Brain size={32} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <p
        className="text-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        No memories yet. Add your first memory to help Alma understand you better.
      </p>
    </div>
  )
}
