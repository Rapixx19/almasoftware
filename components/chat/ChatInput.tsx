// ============================================================
// ALMA · COMPONENTS · ChatInput.tsx
// ============================================================
// What this file does: Text input for composing chat messages
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts, lucide-react
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode for elderly sizing, Send icon for button.

import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { useMode } from '@/hooks/useMode'
import { Send } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  isDisabled?: boolean
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Chat input field with send button.
 * Auto-resizes textarea, handles Enter to send (Shift+Enter for newline).
 * Elderly mode: larger touch targets (56px vs 48px).
 *
 * @param onSend - Callback when message is submitted
 * @param isDisabled - Whether input should be disabled
 * @returns Input field with send button
 */
export default function ChatInput({ onSend, isDisabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  // Touch target size per accessibility guidelines
  const buttonSize = isElderly ? 56 : 48
  const fontSize = isElderly ? '18px' : '16px'

  /**
   * Handles sending the message.
   * Clears input and resets textarea height.
   */
  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || isDisabled) return

    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await onSend(trimmed)
  }, [value, isDisabled, onSend])

  /**
   * Handles keyboard events.
   * Enter sends, Shift+Enter adds newline.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /**
   * Auto-resize textarea based on content.
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)

    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const canSend = value.trim().length > 0 && !isDisabled

  return (
    <div
      className="flex items-end gap-2 p-3"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Input field */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder="Message Alma..."
        rows={1}
        className="flex-1 resize-none rounded-xl px-4 py-3 outline-none"
        style={{
          backgroundColor: 'var(--bg-dim)',
          color: 'var(--text-primary)',
          fontSize,
          lineHeight: '1.5',
          minHeight: buttonSize,
        }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className="flex items-center justify-center rounded-full transition-opacity"
        style={{
          width: buttonSize,
          height: buttonSize,
          backgroundColor: canSend ? 'var(--accent)' : 'var(--bg-dim)',
          opacity: canSend ? 1 : 0.5,
        }}
        aria-label="Send message"
      >
        <Send
          size={isElderly ? 24 : 20}
          style={{ color: canSend ? 'var(--text-on-accent)' : 'var(--text-tertiary)' }}
        />
      </button>
    </div>
  )
}
