// ============================================================
// ALMA · COMPONENTS · MessageBubble.tsx
// ============================================================
// What this file does: Renders a single chat message with role-based styling
// Module: chat — see modules/chat/README.md
// Depends on: types/alma.ts, hooks/useMode.ts
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly-aware font sizes.

import { useMode } from '@/hooks/useMode'
import type { AlmaMessage } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface MessageBubbleProps {
  message: AlmaMessage
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
 * Renders a chat message bubble with role-based styling.
 * User messages: right-aligned with accent background.
 * Assistant messages: left-aligned with surface background.
 * Elderly mode: larger fonts (18px vs 15px).
 *
 * @param message - The message to display
 * @returns Styled message bubble
 */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const { mode } = useMode()
  const isUser = message.role === 'user'
  const isElderly = mode === 'elderly'

  // Font sizes based on mode (Rule 09: mode-aware styling)
  const fontSize = isElderly ? '18px' : '15px'
  const timeSize = isElderly ? '14px' : '12px'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3"
        style={{
          backgroundColor: isUser ? 'var(--accent)' : 'var(--bg-surface)',
          color: isUser ? 'var(--text-on-accent)' : 'var(--text-primary)',
        }}
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
