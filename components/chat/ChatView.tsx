// ============================================================
// ALMA · COMPONENTS · ChatView.tsx
// ============================================================
// What this file does: Main chat interface orchestrating all chat components
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useChat, MessageBubble, TypingIndicator, ChatInput
// Used by: app/app/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Chat hook for state, sub-components for UI, icon for empty state.

import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import { MessageCircle } from 'lucide-react'

// ─── LOADING SKELETON ─────────────────────────────────────
// Why: Rule 09 — show skeleton on mount to prevent blank flash.

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4">
      {/* Fake message bubbles */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} mb-3`}
        >
          <div
            className="rounded-2xl h-16 animate-pulse"
            style={{
              backgroundColor: 'var(--bg-surface)',
              width: `${50 + (i * 10)}%`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── ERROR STATE ──────────────────────────────────────────
// Why: Rule 09 — handle error state gracefully.

function ChatError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <p
        className="text-center"
        style={{ color: 'var(--error)' }}
      >
        {message}
      </p>
      <p
        className="text-center mt-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        Please try refreshing the page.
      </p>
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────
// Why: Rule 09 — show helpful empty state to encourage first message.

function ChatEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div
        className="p-6 rounded-full mb-4"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <MessageCircle size={40} style={{ color: 'var(--accent)' }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Start a conversation
      </h2>
      <p
        className="text-center max-w-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        Say hello to Alma! I&apos;m here to help you manage your day.
      </p>
    </div>
  )
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Main chat interface component.
 * Handles loading, error, and empty states (Rule 09).
 * Auto-scrolls to new messages.
 *
 * @returns Complete chat interface
 */
export default function ChatView() {
  const { messages, isLoading, error, sendMessage, isTyping } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  // Why: Keeps newest messages in view without user action
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Loading state
  if (isLoading) {
    return <ChatSkeleton />
  }

  // Error state
  if (error) {
    return <ChatError message={error.message} />
  }

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: 'var(--bg-base)',
        // Fill the space between status bar and bottom nav
        height: 'calc(100vh - var(--status-bar-height) - var(--bottom-nav-height))',
      }}
    >
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ overscrollBehavior: 'contain' }}
      >
        {messages.length === 0 ? (
          <ChatEmpty />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSend={sendMessage} isDisabled={isTyping} />
    </div>
  )
}
