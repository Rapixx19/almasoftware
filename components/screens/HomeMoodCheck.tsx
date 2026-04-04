// ============================================================
// ALMA · COMPONENTS · HomeMoodCheck.tsx
// ============================================================
// What this file does: Daily mood check-in with 5-emoji selector
// Module: screens — Home screen components
// Depends on: react, lib/supabase/client
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

interface HomeMoodCheckProps {
  onMoodSelect: (mood: number) => Promise<void>
  hasLoggedToday?: boolean
  isLoading?: boolean
  className?: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const MOODS = [
  { value: 1, emoji: '😔', label: 'Struggling' },
  { value: 2, emoji: '😕', label: 'Not great' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
]

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Daily mood check-in selector inspired by Kalon's Morning Pulse.
 * Shows 5 emoji options, dismisses after selection.
 *
 * @param onMoodSelect - Callback when mood is selected
 * @param hasLoggedToday - Whether user already logged mood today
 * @param isLoading - Loading state
 * @param className - Additional classes
 * @returns Mood selector component or null if already logged
 */
export function HomeMoodCheck({
  onMoodSelect,
  hasLoggedToday,
  isLoading,
  className,
}: HomeMoodCheckProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if already logged or dismissed
  if (hasLoggedToday || isDismissed || isLoading) return null

  const handleSelect = async (mood: number) => {
    setSelectedMood(mood)
    setIsSubmitting(true)
    try {
      await onMoodSelect(mood)
      // Brief delay to show selection before dismissing
      setTimeout(() => setIsDismissed(true), 400)
    } catch {
      setIsSubmitting(false)
      setSelectedMood(null)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl p-4 text-center transition-all',
        className
      )}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      <p
        className="text-sm mb-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        How are you feeling today?
      </p>

      <div className="flex justify-center gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            disabled={isSubmitting}
            aria-label={mood.label}
            className={cn(
              'text-2xl p-2 rounded-full transition-all',
              'hover:scale-110 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              selectedMood === mood.value && 'scale-125 ring-2',
              isSubmitting && selectedMood !== mood.value && 'opacity-30'
            )}
            style={{
              backgroundColor: selectedMood === mood.value
                ? 'var(--accent-light)'
                : 'transparent',
              '--tw-ring-color': 'var(--accent)',
              '--tw-ring-offset-color': 'var(--bg-surface)',
            } as React.CSSProperties}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
