// ============================================================
// ALMA · HOOKS · useChat.ts
// ============================================================
// What this file does: Manages chat state with realtime updates
// Module: chat — see modules/chat/README.md
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: components/chat/ChatView.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Browser client for realtime, React hooks for state management.

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlmaMessage } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────
// Why: Explicit return type for hook consumers (Rule 11).

interface UseChatReturn {
  messages: AlmaMessage[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  isTyping: boolean
}

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Limit initial fetch to prevent loading too many messages.

const MAX_INITIAL_MESSAGES = 50

// ─── HOOK ─────────────────────────────────────────────────

/**
 * Manages chat messages with realtime updates and optimistic sending.
 * Fetches history on mount, subscribes to new messages via Supabase Realtime.
 *
 * @returns Chat state and actions { messages, isLoading, error, sendMessage, isTyping }
 * @throws Never throws — errors captured in error state
 * @example
 * const { messages, sendMessage, isTyping } = useChat()
 * await sendMessage("Hello Alma!")
 */
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<AlmaMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  // Fetch initial messages and subscribe to realtime updates
  useEffect(() => {
    let isMounted = true

    const initChat = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return

        setUserId(user.id)

        // Fetch recent messages
        const { data, error: fetchError } = await supabase
          .from('alma_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(MAX_INITIAL_MESSAGES)

        if (fetchError) throw new Error(fetchError.message)
        if (isMounted) {
          setMessages((data as AlmaMessage[]) || [])
          setIsLoading(false)
        }

        // Subscribe to new messages
        // Why: Realtime updates ensure messages appear instantly
        const channel = supabase
          .channel(`messages-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'alma_messages',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (!isMounted) return
              const newMessage = payload.new as AlmaMessage
              // Avoid duplicates from optimistic updates
              setMessages((prev) => {
                const exists = prev.some((m) => m.id === newMessage.id)
                return exists ? prev : [...prev, newMessage]
              })
            }
          )
          .subscribe()

        return () => { channel.unsubscribe() }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load messages'))
          setIsLoading(false)
        }
      }
    }

    initChat()
    return () => { isMounted = false }
  }, [supabase])

  /**
   * Sends a message to Alma via API and handles response.
   * Shows user message instantly (optimistic), then adds assistant response.
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!userId || !content.trim()) return

    const trimmedContent = content.trim()

    // Optimistic update: show user message immediately
    // Why: Instant feedback makes chat feel responsive
    const optimisticId = `optimistic-${Date.now()}`
    const optimisticMessage: AlmaMessage = {
      id: optimisticId,
      user_id: userId,
      role: 'user',
      content: trimmedContent,
      channel: 'in-app',
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setError(null)
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        throw new Error(data.error || 'Failed to send message')
      }

      // Replace optimistic message with real one, add assistant response
      const { userMessage, assistantMessage } = data
      setMessages((prev) => {
        // Remove optimistic, add real messages
        const filtered = prev.filter((m) => m.id !== optimisticId)
        if (userMessage) filtered.push(userMessage)
        if (assistantMessage) filtered.push(assistantMessage)
        return filtered
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'))
    } finally {
      setIsTyping(false)
    }
  }, [userId])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isTyping,
  }
}
