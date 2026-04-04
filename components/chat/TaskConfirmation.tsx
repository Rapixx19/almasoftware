// ============================================================
// ALMA · COMPONENTS · TaskConfirmation.tsx
// ============================================================
// What this file does: Inline confirmation UI when a task is detected in chat
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts, lucide-react
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly sizing, icons for visual clarity.

import { useState } from 'react'
import { useMode } from '@/hooks/useMode'
import { Check, Pencil, X, Calendar, AlertCircle } from 'lucide-react'
import type { TaskPriority } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export interface ExtractedTask {
  title: string
  dueDate?: string
  priority?: TaskPriority
  confidence?: number  // 0-1, how confident the extraction is
}

interface TaskConfirmationProps {
  task: ExtractedTask
  /** Called when user confirms the task */
  onConfirm: (task: ExtractedTask) => void
  /** Called when user wants to edit before adding */
  onEdit?: (task: ExtractedTask) => void
  /** Called when user skips/dismisses */
  onSkip: () => void
}

// ─── HELPERS ──────────────────────────────────────────────

function getPriorityColor(priority?: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'var(--warm)'
    case 'low':
      return 'var(--success)'
    default:
      return 'var(--text-secondary)'
  }
}

function getPriorityLabel(priority?: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'High'
    case 'low':
      return 'Low'
    default:
      return 'Normal'
  }
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Inline confirmation UI shown when Alma detects a task in conversation.
 * Allows user to quickly add, edit, or skip the detected task.
 * Compact design to fit naturally in chat flow.
 *
 * @param task - The extracted task data
 * @param onConfirm - Called when user confirms addition
 * @param onEdit - Called when user wants to edit first
 * @param onSkip - Called when user dismisses
 * @returns Inline task confirmation UI
 */
export default function TaskConfirmation({
  task,
  onConfirm,
  onEdit,
  onSkip,
}: TaskConfirmationProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const fontSize = isElderly ? '15px' : '13px'
  const smallSize = isElderly ? '12px' : '10px'
  const buttonSize = isElderly ? '44px' : '36px'

  const handleAction = (action: () => void) => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      action()
    }, 200)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="mb-3"
      style={{
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'opacity var(--duration-fast), transform var(--duration-fast)',
      }}
    >
      <div
        className="rounded-xl p-3 border flex items-center gap-3"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--accent)',
          borderWidth: '1px',
          animation: 'slideInUp var(--duration-normal) var(--ease-enter)',
        }}
      >
        {/* Checkmark icon */}
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: buttonSize,
            height: buttonSize,
            backgroundColor: 'var(--accent)',
            opacity: 0.15,
          }}
        >
          <Check size={isElderly ? 20 : 16} style={{ color: 'var(--accent)' }} />
        </div>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <p
            className="font-medium truncate"
            style={{ fontSize, color: 'var(--text-primary)' }}
          >
            {task.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={10} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}>
                  {task.dueDate}
                </span>
              </div>
            )}
            {task.priority && task.priority !== 'normal' && (
              <div className="flex items-center gap-1">
                <AlertCircle size={10} style={{ color: getPriorityColor(task.priority) }} />
                <span style={{ fontSize: smallSize, color: getPriorityColor(task.priority) }}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Add button */}
          <button
            onClick={() => handleAction(() => onConfirm(task))}
            className="flex items-center justify-center rounded-full"
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: 'var(--accent)',
            }}
            aria-label="Add to tasks"
          >
            <Check size={isElderly ? 20 : 16} style={{ color: 'var(--text-on-accent)' }} />
          </button>

          {/* Edit button (optional) */}
          {onEdit && (
            <button
              onClick={() => handleAction(() => onEdit(task))}
              className="flex items-center justify-center rounded-full"
              style={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: 'var(--bg-dim)',
              }}
              aria-label="Edit task"
            >
              <Pencil size={isElderly ? 18 : 14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          )}

          {/* Skip button */}
          <button
            onClick={() => handleAction(onSkip)}
            className="flex items-center justify-center rounded-full"
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: 'var(--bg-dim)',
            }}
            aria-label="Skip"
          >
            <X size={isElderly ? 18 : 14} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Animation styles */}
        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}
