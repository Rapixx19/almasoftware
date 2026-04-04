// ============================================================
// ALMA · COMPONENTS · ResponseCard.tsx
// ============================================================
// What this file does: Renders structured response cards in chat (tasks, events, summaries)
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts, lucide-react
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly sizing, icons for card types.

import { useState } from 'react'
import { useMode } from '@/hooks/useMode'
import {
  CheckSquare,
  Calendar,
  List,
  X,
  Plus,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import type { TaskPriority } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export type CardType = 'task' | 'event' | 'summary'

export interface TaskCardData {
  type: 'task'
  title: string
  dueDate?: string
  priority?: TaskPriority
}

export interface EventCardData {
  type: 'event'
  title: string
  time?: string
  location?: string
}

export interface SummaryCardData {
  type: 'summary'
  title: string
  items: string[]
}

export type ResponseCardData = TaskCardData | EventCardData | SummaryCardData

interface ResponseCardProps {
  data: ResponseCardData
  /** Called when primary action (Add) is triggered */
  onAction?: (data: ResponseCardData) => void
  /** Called when card is dismissed */
  onDismiss?: () => void
}

// ─── HELPERS ──────────────────────────────────────────────

function getPriorityColor(priority?: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'var(--warm)'
    case 'low':
      return 'var(--success)'
    default:
      return 'var(--accent)'
  }
}

function getPriorityLabel(priority?: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'High Priority'
    case 'low':
      return 'Low Priority'
    default:
      return 'Normal'
  }
}

// ─── CARD COMPONENTS ──────────────────────────────────────

function TaskCard({
  data,
  onAction,
  onDismiss,
  isElderly,
}: {
  data: TaskCardData
  onAction?: ((data: TaskCardData) => void) | undefined
  onDismiss?: (() => void) | undefined
  isElderly: boolean
}) {
  const fontSize = isElderly ? '16px' : '14px'
  const smallSize = isElderly ? '13px' : '11px'
  const buttonPadding = isElderly ? '10px 16px' : '8px 12px'

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} style={{ color: 'var(--accent)' }} />
          <span
            className="font-medium"
            style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}
          >
            Task Detected
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/5"
            aria-label="Dismiss"
          >
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div
        className="h-px mb-3"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Title */}
      <p
        className="font-medium mb-2"
        style={{ fontSize, color: 'var(--text-primary)' }}
      >
        "{data.title}"
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4">
        {data.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}>
              Due: {data.dueDate}
            </span>
          </div>
        )}
        {data.priority && (
          <div className="flex items-center gap-1">
            <AlertCircle size={12} style={{ color: getPriorityColor(data.priority) }} />
            <span style={{ fontSize: smallSize, color: getPriorityColor(data.priority) }}>
              {getPriorityLabel(data.priority)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAction?.(data)}
          className="flex items-center gap-1 rounded-lg font-medium"
          style={{
            padding: buttonPadding,
            fontSize: smallSize,
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          <Plus size={14} />
          Add to Tasks
        </button>
        <button
          onClick={onDismiss}
          className="rounded-lg"
          style={{
            padding: buttonPadding,
            fontSize: smallSize,
            backgroundColor: 'var(--bg-dim)',
            color: 'var(--text-secondary)',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

function EventCard({
  data,
  onAction,
  onDismiss,
  isElderly,
}: {
  data: EventCardData
  onAction?: ((data: EventCardData) => void) | undefined
  onDismiss?: (() => void) | undefined
  isElderly: boolean
}) {
  const fontSize = isElderly ? '16px' : '14px'
  const smallSize = isElderly ? '13px' : '11px'
  const buttonPadding = isElderly ? '10px 16px' : '8px 12px'

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} style={{ color: 'var(--purple)' }} />
          <span
            className="font-medium"
            style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}
          >
            Event Detected
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/5"
            aria-label="Dismiss"
          >
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div
        className="h-px mb-3"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Title */}
      <p
        className="font-medium mb-2"
        style={{ fontSize, color: 'var(--text-primary)' }}
      >
        "{data.title}"
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4">
        {data.time && (
          <div className="flex items-center gap-1">
            <Clock size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}>
              {data.time}
            </span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-1">
            <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}>
              {data.location}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAction?.(data)}
          className="flex items-center gap-1 rounded-lg font-medium"
          style={{
            padding: buttonPadding,
            fontSize: smallSize,
            backgroundColor: 'var(--purple)',
            color: 'white',
          }}
        >
          <Plus size={14} />
          Add to Calendar
        </button>
        <button
          onClick={onDismiss}
          className="rounded-lg"
          style={{
            padding: buttonPadding,
            fontSize: smallSize,
            backgroundColor: 'var(--bg-dim)',
            color: 'var(--text-secondary)',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

function SummaryCard({
  data,
  onDismiss,
  isElderly,
}: {
  data: SummaryCardData
  onDismiss?: () => void
  isElderly: boolean
}) {
  const fontSize = isElderly ? '16px' : '14px'
  const smallSize = isElderly ? '13px' : '11px'

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <List size={16} style={{ color: 'var(--success)' }} />
          <span
            className="font-medium"
            style={{ fontSize: smallSize, color: 'var(--text-secondary)' }}
          >
            {data.title}
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/5"
            aria-label="Dismiss"
          >
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div
        className="h-px mb-3"
        style={{ backgroundColor: 'var(--border)' }}
      />

      {/* Items */}
      <ul className="space-y-2">
        {data.items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2"
            style={{ fontSize, color: 'var(--text-primary)' }}
          >
            <span style={{ color: 'var(--accent)' }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────

/**
 * Renders structured response cards for tasks, events, and summaries.
 * Used when Claude detects actionable items in the conversation.
 *
 * @param data - Card data with type discriminator
 * @param onAction - Callback for primary action (Add to tasks/calendar)
 * @param onDismiss - Callback when card is dismissed
 * @returns Appropriate card type based on data
 */
export default function ResponseCard({
  data,
  onAction,
  onDismiss,
}: ResponseCardProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [isVisible, setIsVisible] = useState(true)

  // Handle dismiss with animation
  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 200)
  }

  if (!isVisible) {
    return null
  }

  // Render based on card type
  switch (data.type) {
    case 'task':
      return (
        <div
          className="mb-3"
          style={{
            animation: 'slideInLeft var(--duration-normal) var(--ease-enter)',
          }}
        >
          <TaskCard
            data={data}
            onAction={onAction as ((data: TaskCardData) => void) | undefined}
            onDismiss={handleDismiss}
            isElderly={isElderly}
          />
          <style jsx>{`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )

    case 'event':
      return (
        <div
          className="mb-3"
          style={{
            animation: 'slideInLeft var(--duration-normal) var(--ease-enter)',
          }}
        >
          <EventCard
            data={data}
            onAction={onAction as ((data: EventCardData) => void) | undefined}
            onDismiss={handleDismiss}
            isElderly={isElderly}
          />
          <style jsx>{`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )

    case 'summary':
      return (
        <div
          className="mb-3"
          style={{
            animation: 'slideInLeft var(--duration-normal) var(--ease-enter)',
          }}
        >
          <SummaryCard
            data={data}
            onDismiss={handleDismiss}
            isElderly={isElderly}
          />
          <style jsx>{`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )
  }
}
