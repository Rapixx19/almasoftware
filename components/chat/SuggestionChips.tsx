// ============================================================
// ALMA · COMPONENTS · SuggestionChips.tsx
// ============================================================
// What this file does: Dynamic quick-reply buttons that adapt to chat context
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly-aware sizing, useState for interaction states.

import { useState } from 'react'
import { useMode } from '@/hooks/useMode'

// ─── TYPES ────────────────────────────────────────────────

export type SuggestionContext =
  | 'greeting'      // Initial state or after greeting
  | 'task'          // After discussing tasks
  | 'mood'          // After mood check-in
  | 'general'       // Default fallback

export interface Suggestion {
  label: string
  action?: string  // If different from label
}

interface SuggestionChipsProps {
  /** Current context determines which suggestions to show */
  context?: SuggestionContext
  /** Callback when a suggestion is selected */
  onSelect: (text: string) => void
  /** Whether chips should be disabled */
  isDisabled?: boolean
  /** Custom suggestions to override defaults */
  customSuggestions?: Suggestion[]
}

// ─── SUGGESTIONS BY CONTEXT ───────────────────────────────

const SUGGESTIONS: Record<SuggestionContext, Suggestion[]> = {
  greeting: [
    { label: 'Plan my day' },
    { label: "What's on my calendar?" },
    { label: 'Create a task' },
  ],
  task: [
    { label: 'Add to tasks' },
    { label: 'Set a reminder' },
    { label: "What's next?" },
  ],
  mood: [
    { label: 'Tell me more' },
    { label: "Let's brainstorm" },
    { label: 'I need help' },
  ],
  general: [
    { label: 'Help me with something' },
    { label: "What's on my calendar?" },
    { label: 'Show my tasks' },
  ],
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Dynamic suggestion chips that appear below chat input.
 * Adapts suggestions based on conversation context.
 * Supports elderly mode with larger touch targets.
 *
 * @param context - Current chat context for suggestion selection
 * @param onSelect - Callback when suggestion is tapped
 * @param isDisabled - Whether chips are disabled
 * @param customSuggestions - Override default suggestions
 * @returns Animated suggestion chips row
 */
export default function SuggestionChips({
  context = 'greeting',
  onSelect,
  isDisabled = false,
  customSuggestions,
}: SuggestionChipsProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)

  // Use custom suggestions or defaults based on context
  const suggestions = customSuggestions ?? SUGGESTIONS[context]

  const handleSelect = (suggestion: Suggestion) => {
    if (isDisabled) return
    const text = suggestion.action ?? suggestion.label
    onSelect(text)
  }

  // Sizing based on mode
  const fontSize = isElderly ? '15px' : '13px'
  const paddingY = isElderly ? '10px' : '8px'
  const paddingX = isElderly ? '16px' : '12px'

  return (
    <div
      className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {suggestions.map((suggestion, index) => {
        const isPressed = pressedIndex === index

        return (
          <button
            key={suggestion.label}
            onClick={() => handleSelect(suggestion)}
            disabled={isDisabled}
            onMouseDown={() => setPressedIndex(index)}
            onMouseUp={() => setPressedIndex(null)}
            onMouseLeave={() => setPressedIndex(null)}
            onTouchStart={() => setPressedIndex(index)}
            onTouchEnd={() => setPressedIndex(null)}
            className="flex-shrink-0 rounded-full border whitespace-nowrap"
            style={{
              fontSize,
              padding: `${paddingY} ${paddingX}`,
              backgroundColor: isPressed ? 'var(--bg-elevated)' : 'var(--bg-surface)',
              borderColor: 'var(--border)',
              color: isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
              opacity: isDisabled ? 0.5 : 1,
              transform: isPressed ? 'scale(0.95)' : 'scale(1)',
              transition: `transform var(--duration-fast) var(--ease-move),
                          background-color var(--duration-fast) var(--ease-move)`,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            aria-label={`Suggest: ${suggestion.label}`}
          >
            {suggestion.label}
          </button>
        )
      })}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
