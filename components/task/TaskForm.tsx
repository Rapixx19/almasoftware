// ============================================================
// ALMA · COMPONENTS · TaskForm.tsx
// ============================================================
// What this file does: Form for creating/editing tasks
// Module: tasks — see modules/tasks/README.md
// Depends on: hooks/useMode.ts, types/alma.ts
// Used by: app/app/tasks/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { TaskPriority } from '@/types/alma'

interface TaskFormProps {
  onSubmit: (title: string, priority: TaskPriority, dueDate: string | null) => Promise<void>
  onClose: () => void
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]

/** Modal form for creating a new task. */
export default function TaskForm({ onSubmit, onClose }: TaskFormProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fontSize = isElderly ? '18px' : '16px'
  const labelSize = isElderly ? '16px' : '14px'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return
    setIsSubmitting(true)
    try { await onSubmit(title.trim(), priority, dueDate || null); onClose() }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold" style={{ fontSize: isElderly ? '22px' : '18px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Add Task
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X size={24} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{ fontSize: labelSize, color: 'var(--text-secondary)' }}>Task</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Call the doctor"
              className="w-full p-3 rounded-xl"
              style={{ fontSize, backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              maxLength={500} autoFocus />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{ fontSize: labelSize, color: 'var(--text-secondary)' }}>Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                  className="px-4 py-2 rounded-full transition-colors flex-1"
                  style={{ fontSize: labelSize, backgroundColor: priority === p.value ? 'var(--accent)' : 'var(--bg-surface)', color: priority === p.value ? 'var(--text-on-accent)' : 'var(--text-secondary)' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ fontSize: labelSize, color: 'var(--text-secondary)' }}>Due Date (optional)</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 rounded-xl"
              style={{ fontSize, backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
          </div>

          <button type="submit" disabled={!title.trim() || isSubmitting}
            className="w-full py-3 rounded-xl font-medium transition-opacity disabled:opacity-50"
            style={{ fontSize, backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}>
            {isSubmitting ? 'Saving...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
