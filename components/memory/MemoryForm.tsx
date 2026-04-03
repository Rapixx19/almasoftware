// ============================================================
// ALMA · COMPONENTS · MemoryForm.tsx
// ============================================================
// What this file does: Form for creating/editing memories
// Module: memory — see modules/memory/README.md
// Depends on: hooks/useMode.ts, types/alma.ts
// Used by: app/app/memories/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { MemoryCategory } from '@/types/alma'

interface MemoryFormProps {
  onSubmit: (content: string, category: MemoryCategory) => Promise<void>
  onClose: () => void
}

const CATEGORIES: { value: MemoryCategory; label: string }[] = [
  { value: 'preference', label: 'Preference' },
  { value: 'fact', label: 'Fact' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'routine', label: 'Routine' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
]

/** Modal form for creating a new memory. */
export default function MemoryForm({ onSubmit, onClose }: MemoryFormProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<MemoryCategory>('fact')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fontSize = isElderly ? '18px' : '16px'
  const labelSize = isElderly ? '16px' : '14px'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return
    setIsSubmitting(true)
    try { await onSubmit(content.trim(), category); onClose() }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold" style={{ fontSize: isElderly ? '22px' : '18px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Add Memory
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X size={24} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{ fontSize: labelSize, color: 'var(--text-secondary)' }}>Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className="px-3 py-2 rounded-full transition-colors"
                  style={{ fontSize: labelSize, backgroundColor: category === cat.value ? 'var(--accent)' : 'var(--bg-surface)', color: category === cat.value ? 'var(--text-on-accent)' : 'var(--text-secondary)' }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ fontSize: labelSize, color: 'var(--text-secondary)' }}>Memory</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="E.g., Prefers to be called by first name"
              className="w-full p-3 rounded-xl resize-none"
              style={{ fontSize, backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              rows={4} maxLength={2000} autoFocus />
          </div>

          <button type="submit" disabled={!content.trim() || isSubmitting}
            className="w-full py-3 rounded-xl font-medium transition-opacity disabled:opacity-50"
            style={{ fontSize, backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}>
            {isSubmitting ? 'Saving...' : 'Save Memory'}
          </button>
        </form>
      </div>
    </div>
  )
}
