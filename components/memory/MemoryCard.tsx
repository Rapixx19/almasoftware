// ============================================================
// ALMA · COMPONENTS · MemoryCard.tsx
// ============================================================
// What this file does: Renders a single memory with category badge
// Module: memory — see modules/memory/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/memory/MemoryList.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly-aware font sizes.

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaMemory, MemoryCategory } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface MemoryCardProps {
  memory: AlmaMemory
  onUpdate: (id: string, updates: { content?: string; category?: MemoryCategory }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Category labels for display.

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  preference: 'Preference',
  fact: 'Fact',
  relationship: 'Relationship',
  routine: 'Routine',
  health: 'Health',
  other: 'Other',
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Renders a memory card with edit and delete actions.
 * Elderly mode: larger fonts and touch targets.
 */
export default function MemoryCard({ memory, onUpdate, onDelete }: MemoryCardProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(memory.content)

  const fontSize = isElderly ? '16px' : '14px'
  const buttonSize = isElderly ? 24 : 18

  const handleSave = async () => {
    if (editContent.trim() && editContent !== memory.content) {
      await onUpdate(memory.id, { content: editContent.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(memory.content)
    setIsEditing(false)
  }

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          {CATEGORY_LABELS[memory.category]}
        </span>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} aria-label="Save">
                <Check size={buttonSize} style={{ color: 'var(--success)' }} />
              </button>
              <button onClick={handleCancel} aria-label="Cancel">
                <X size={buttonSize} style={{ color: 'var(--error)' }} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} aria-label="Edit">
                <Pencil size={buttonSize} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button onClick={() => onDelete(memory.id)} aria-label="Delete">
                <Trash2 size={buttonSize} style={{ color: 'var(--error)' }} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 rounded-lg resize-none"
          style={{
            fontSize,
            backgroundColor: 'var(--bg-base)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
          rows={3}
          autoFocus
        />
      ) : (
        <p
          style={{ fontSize, color: 'var(--text-primary)', lineHeight: '1.5' }}
        >
          {memory.content}
        </p>
      )}
    </div>
  )
}
