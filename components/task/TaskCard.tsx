// ============================================================
// ALMA · COMPONENTS · TaskCard.tsx
// ============================================================
// What this file does: Renders a single task with completion toggle
// Module: tasks — see modules/tasks/README.md
// Depends on: types/alma.ts, hooks/useMode.ts, lucide-react
// Used by: components/task/TaskList.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useState } from 'react'
import { Pencil, Trash2, Check, X, Calendar } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import type { AlmaTask, TaskPriority } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface TaskCardProps {
  task: AlmaTask
  onUpdate: (id: string, updates: { title?: string; priority?: TaskPriority; due_date?: string | null }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onToggleComplete: (id: string) => Promise<void>
}

// ─── CONSTANTS ────────────────────────────────────────────

const PRIORITY_STYLES: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  low: { bg: 'var(--bg-surface)', text: 'var(--text-secondary)', label: 'Low' },
  normal: { bg: 'var(--accent)', text: 'var(--text-on-accent)', label: 'Normal' },
  high: { bg: 'var(--error)', text: 'white', label: 'High' },
}

// ─── HELPERS ──────────────────────────────────────────────

function formatDueDate(dueDate: string | null, isCompleted: boolean): { text: string; isOverdue: boolean } {
  if (!dueDate) return { text: '', isOverdue: false }
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isOverdue = !isCompleted && due < today
  return { text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), isOverdue }
}

// ─── COMPONENT ────────────────────────────────────────────

export default function TaskCard({ task, onUpdate, onDelete, onToggleComplete }: TaskCardProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const fontSize = isElderly ? '16px' : '14px'
  const buttonSize = isElderly ? 24 : 18
  const checkboxSize = isElderly ? 24 : 20
  const { text: dueDateText, isOverdue } = formatDueDate(task.due_date, task.is_completed)

  const handleSave = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      await onUpdate(task.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  return (
    <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: 'var(--bg-surface)', opacity: task.is_completed ? 0.7 : 1 }}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="flex-shrink-0 rounded-md border-2 flex items-center justify-center mt-0.5"
          style={{ width: checkboxSize, height: checkboxSize, borderColor: task.is_completed ? 'var(--success)' : 'var(--border)', backgroundColor: task.is_completed ? 'var(--success)' : 'transparent' }}
          aria-label={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.is_completed && <Check size={checkboxSize - 6} color="white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Priority badge */}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: PRIORITY_STYLES[task.priority].bg, color: PRIORITY_STYLES[task.priority].text }}>
              {PRIORITY_STYLES[task.priority].label}
            </span>
            {/* Due date */}
            {dueDateText && (
              <span className="flex items-center gap-1 text-xs" style={{ color: isOverdue ? 'var(--error)' : 'var(--text-secondary)' }}>
                <Calendar size={12} />
                {dueDateText}
              </span>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 rounded-lg"
              style={{ fontSize, backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
            />
          ) : (
            <p style={{ fontSize, color: 'var(--text-primary)', lineHeight: '1.5', textDecoration: task.is_completed ? 'line-through' : 'none' }}>
              {task.title}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
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
              <button onClick={() => onDelete(task.id)} aria-label="Delete">
                <Trash2 size={buttonSize} style={{ color: 'var(--error)' }} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
