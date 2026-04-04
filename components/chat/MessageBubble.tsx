// ============================================================
// ALMA · COMPONENTS · MessageBubble.tsx
// ============================================================
// What this file does: Renders a single chat message with role-based styling and animations
// Module: chat — see modules/chat/README.md
// Depends on: types/alma.ts, hooks/useMode.ts
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly-aware font sizes, useState for animation states.

import { useState, useEffect } from 'react'
import { useMode } from '@/hooks/useMode'
import type { AlmaMessage } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface MessageBubbleProps {
  message: AlmaMessage
  /** Whether this is a new message that should animate in */
  isNew?: boolean
}

// ─── HELPERS ──────────────────────────────────────────────

/**
 * Formats timestamp for display.
 * Shows time only for recent messages, date for older ones.
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Renders a chat message bubble with role-based styling and slide-in animation.
 * User messages: right-aligned with accent background, slides from right.
 * Assistant messages: left-aligned with surface background, slides from left.
 * Elderly mode: larger fonts (18px vs 15px).
 * Includes subtle scale on tap for tactile feedback.
 *
 * @param message - The message to display
 * @param isNew - Whether to animate the message in (default: true for messages < 2s old)
 * @returns Styled message bubble with animations
 */
export default function MessageBubble({ message, isNew }: MessageBubbleProps) {
  const { mode } = useMode()
  const isUser = message.role === 'user'
  const isElderly = mode === 'elderly'
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Determine if message should animate (new messages or < 2 seconds old)
  const shouldAnimate = isNew ?? (Date.now() - new Date(message.created_at).getTime() < 2000)

  // Trigger entrance animation on mount
  useEffect(() => {
    if (shouldAnimate) {
      // Small delay to ensure CSS transition works
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [shouldAnimate])

  // Font sizes based on mode (Rule 09: mode-aware styling)
  const fontSize = isElderly ? '18px' : '15px'
  const timeSize = isElderly ? '14px' : '12px'

  // Animation styles
  const slideDirection = isUser ? 'translateX(20px)' : 'translateX(-20px)'
  const initialTransform = shouldAnimate && !isVisible ? slideDirection : 'translateX(0)'
  const initialOpacity = shouldAnimate && !isVisible ? 0 : 1
  const scale = isPressed ? 0.98 : 1

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      style={{
        opacity: initialOpacity,
        transform: `${initialTransform} scale(${scale})`,
        transition: `opacity var(--duration-normal) var(--ease-enter),
                     transform var(--duration-normal) var(--ease-enter)`,
      }}
    >
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3 cursor-pointer select-none"
        style={{
          backgroundColor: isUser ? 'var(--accent)' : 'var(--bg-surface)',
          color: isUser ? 'var(--text-on-accent)' : 'var(--text-primary)',
          transition: 'background-color var(--duration-fast) var(--ease-move)',
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Message content */}
        <p
          className="whitespace-pre-wrap break-words"
          style={{
            fontSize,
            lineHeight: '1.5',
          }}
        >
          {message.content}
        </p>

        {/* Timestamp */}
        <p
          className="mt-1"
          style={{
            fontSize: timeSize,
            color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}
