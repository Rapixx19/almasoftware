// ============================================================
// ALMA · COMPONENTS · HomeUpcomingCard.tsx
// ============================================================
// What this file does: Priority tasks & upcoming meetings card
// Module: screens — Home screen components
// Depends on: components/ui/Card, components/ui/Skeleton, lucide-react
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import { Calendar, CheckSquare, ChevronRight, Pin } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface UpcomingTask {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: Date | null
}

interface UpcomingEvent {
  id: string
  title: string
  startTime: Date
  endTime: Date
}

interface HomeUpcomingCardProps {
  tasks: UpcomingTask[]
  events: UpcomingEvent[]
  isLoading?: boolean
  className?: string
}

// ─── HELPERS ──────────────────────────────────────────────

function getPriorityColor(priority: UpcomingTask['priority']): string {
  switch (priority) {
    case 'urgent': return 'var(--error)'
    case 'high': return 'var(--warm)'
    case 'medium': return 'var(--accent)'
    default: return 'var(--text-muted)'
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDueDate(date: Date | null): string {
  if (!date) return ''
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isToday = date.toDateString() === now.toDateString()
  const isTomorrow = date.toDateString() === tomorrow.toDateString()

  if (isToday) return 'Today'
  if (isTomorrow) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Shows priority tasks and upcoming calendar events.
 * Color-coded by urgency with tap-to-navigate functionality.
 *
 * @param tasks - Array of priority tasks
 * @param events - Array of upcoming events
 * @param isLoading - Show skeleton state
 * @param className - Additional classes
 * @returns Upcoming card component
 */
export function HomeUpcomingCard({
  tasks,
  events,
  isLoading,
  className,
}: HomeUpcomingCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('', className)}>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </Card>
    )
  }

  const hasContent = tasks.length > 0 || events.length > 0

  return (
    <Card className={cn('', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pin size={14} style={{ color: 'var(--accent)' }} />
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            Coming Up
          </h3>
        </div>
        {hasContent && (
          <Link
            href="/app/tasks"
            className="text-xs flex items-center gap-0.5 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            View all
            <ChevronRight size={12} />
          </Link>
        )}
      </div>

      {/* Content */}
      {!hasContent ? (
        <p
          className="text-sm py-4 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Nothing scheduled. Enjoy the calm.
        </p>
      ) : (
        <div className="space-y-2">
          {/* Priority Tasks */}
          {tasks.slice(0, 3).map((task) => (
            <Link
              key={task.id}
              href={`/app/tasks?id=${task.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              />
              <CheckSquare
                size={14}
                style={{ color: 'var(--text-muted)' }}
                className="flex-shrink-0"
              />
              <span
                className="text-sm flex-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <span
                  className="text-xs flex-shrink-0"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </Link>
          ))}

          {/* Upcoming Events */}
          {events.slice(0, 2).map((event) => (
            <Link
              key={event.id}
              href={`/app/calendar?id=${event.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <Calendar
                size={14}
                style={{ color: 'var(--accent)' }}
                className="flex-shrink-0"
              />
              <span
                className="text-sm flex-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {event.title}
              </span>
              <span
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                {formatTime(event.startTime)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
