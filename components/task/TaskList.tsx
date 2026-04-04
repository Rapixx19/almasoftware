// ============================================================
// ALMA · COMPONENTS · TaskList.tsx
// ============================================================
// What this file does: Renders list of tasks with filter tabs
// Module: tasks — see modules/tasks/README.md
// Depends on: components/task/TaskCard.tsx, hooks/useMode.ts
// Used by: app/app/tasks/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { CheckSquare } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaTask, TaskPriority } from '@/types/alma'
import TaskCard from './TaskCard'

// ─── TYPES ────────────────────────────────────────────────

interface TaskListProps {
  tasks: AlmaTask[]
  isLoading: boolean
  filterPriority: TaskPriority | null
  filterCompleted: boolean | null
  onPriorityChange: (priority: TaskPriority | null) => void
  onCompletedChange: (completed: boolean | null) => void
  onUpdate: (id: string, updates: { title?: string; priority?: TaskPriority; due_date?: string | null }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onToggleComplete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const STATUS_FILTERS: { value: boolean | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: false, label: 'Active' },
  { value: true, label: 'Completed' },
]

const PRIORITY_FILTERS: { value: TaskPriority | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
]

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Renders a filterable list of tasks.
 * Handles loading, empty, and populated states (Rule 09).
 */
export default function TaskList({ tasks, isLoading, filterPriority, filterCompleted, onPriorityChange, onCompletedChange, onUpdate, onDelete, onToggleComplete }: TaskListProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const fontSize = isElderly ? '16px' : '14px'

  // Sort: incomplete first, then by due date, then by creation
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1
    if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    if (a.due_date) return -1
    if (b.due_date) return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading tasks...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onCompletedChange(f.value)}
            className="px-3 py-2 rounded-full whitespace-nowrap transition-colors"
            style={{ fontSize, backgroundColor: filterCompleted === f.value ? 'var(--accent)' : 'var(--bg-surface)', color: filterCompleted === f.value ? 'var(--text-on-accent)' : 'var(--text-secondary)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Priority filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {PRIORITY_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => onPriorityChange(f.value)}
            className="px-3 py-2 rounded-full whitespace-nowrap transition-colors"
            style={{ fontSize, backgroundColor: filterPriority === f.value ? 'var(--accent)' : 'var(--bg-surface)', color: filterPriority === f.value ? 'var(--text-on-accent)' : 'var(--text-secondary)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list or empty state */}
      {sortedTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} onToggleComplete={onToggleComplete} />
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
      <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <CheckSquare size={32} style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
        No tasks yet. Add your first task to get started.
      </p>
    </div>
  )
}
