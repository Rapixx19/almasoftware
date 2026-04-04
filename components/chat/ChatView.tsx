// ============================================================
// ALMA · COMPONENTS · ChatView.tsx
// ============================================================
// What this file does: Main chat interface orchestrating all chat components
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useChat, MessageBubble, TypingIndicator, ChatInput, SuggestionChips, TaskConfirmation
// Used by: app/app/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Chat hook for state, sub-components for UI, icon for empty state.

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '@/hooks/useChat'
import { useTasks } from '@/hooks/useTasks'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import SuggestionChips, { type SuggestionContext } from './SuggestionChips'
import TaskConfirmation, { type ExtractedTask } from './TaskConfirmation'
import VoicePlayback from './VoicePlayback'
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

// ─── HELPER: DETERMINE SUGGESTION CONTEXT ─────────────────

function getSuggestionContext(messages: { role: string; content: string }[]): SuggestionContext {
  if (messages.length === 0) return 'greeting'

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant')
  if (!lastAssistantMsg) return 'greeting'

  const content = lastAssistantMsg.content.toLowerCase()

  // Check for task-related content
  if (content.includes('task') || content.includes('remind') || content.includes('todo')) {
    return 'task'
  }

  // Check for mood-related content
  if (content.includes('feel') || content.includes('mood') || content.includes('how are you')) {
    return 'mood'
  }

  return 'general'
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Main chat interface component.
 * Handles loading, error, and empty states (Rule 09).
 * Auto-scrolls to new messages.
 * Includes suggestion chips, task confirmation, and voice playback.
 *
 * @returns Complete chat interface
 */
export default function ChatView() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isTyping,
    extractedTasks,
    clearExtractedTasks,
  } = useChat()
  const { createTask } = useTasks()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)

  // Auto-scroll to bottom when new messages arrive
  // Why: Keeps newest messages in view without user action
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, extractedTasks])

  // Handle suggestion chip selection
  const handleSuggestionSelect = useCallback((text: string) => {
    sendMessage(text)
  }, [sendMessage])

  // Handle task confirmation
  const handleTaskConfirm = useCallback(async (task: ExtractedTask) => {
    await createTask(task.title, task.priority, task.dueDate)
    // Move to next task or clear
    if (currentTaskIndex < extractedTasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1)
    } else {
      clearExtractedTasks()
      setCurrentTaskIndex(0)
    }
  }, [createTask, currentTaskIndex, extractedTasks.length, clearExtractedTasks])

  // Handle task skip
  const handleTaskSkip = useCallback(() => {
    if (currentTaskIndex < extractedTasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1)
    } else {
      clearExtractedTasks()
      setCurrentTaskIndex(0)
    }
  }, [currentTaskIndex, extractedTasks.length, clearExtractedTasks])

  // Get current suggestion context
  const suggestionContext = getSuggestionContext(messages)

  // Loading state
  if (isLoading) {
    return <ChatSkeleton />
  }

  // Error state
  if (error) {
    return <ChatError message={error.message} />
  }

  // Current task to confirm (if any)
  const currentTask = extractedTasks[currentTaskIndex]

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
              <div key={msg.id} className="relative">
                <MessageBubble message={msg} />
                {/* Voice playback for assistant messages */}
                {msg.role === 'assistant' && (
                  <div className="absolute bottom-2 left-4">
                    <VoicePlayback text={msg.content} size="sm" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && <TypingIndicator />}

            {/* Task confirmation UI */}
            {currentTask && !isTyping && (
              <TaskConfirmation
                task={currentTask}
                onConfirm={handleTaskConfirm}
                onSkip={handleTaskSkip}
              />
            )}
          </>
        )}
      </div>

      {/* Suggestion chips */}
      {!isTyping && messages.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
          <SuggestionChips
            context={suggestionContext}
            onSelect={handleSuggestionSelect}
            isDisabled={isTyping}
          />
        </div>
      )}

      {/* Input area */}
      <ChatInput onSend={sendMessage} isDisabled={isTyping} />
    </div>
  )
}
