// ============================================================
// ALMA · API · chat/route.ts
// ============================================================
// What this file does: Handles chat messages with Claude integration and task extraction
// Module: chat — see modules/chat/README.md
// Depends on: lib/supabase/server.ts, lib/ai/system-prompt.ts, lib/ai/memory-context.ts, lib/agents/task-extractor.ts, @anthropic-ai/sdk
// Used by: hooks/useChat.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Zod for validation, server client for RLS, Anthropic SDK for Claude.

import { NextResponse } from 'next/server'
import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import {
  MODEL_ID,
  MAX_TOKENS,
  MAX_CONTEXT_MESSAGES,
  ALMA_SYSTEM_PROMPT,
} from '@/lib/ai/system-prompt'
import { getMemoryContext } from '@/lib/ai/memory-context'
import {
  extractTasksFromConversation,
  hasTaskIntent,
} from '@/lib/agents/task-extractor'

// ─── SCHEMA ───────────────────────────────────────────────
// Why: Rule 08 — Zod validation on all API request bodies.

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(4000),
})

// ─── HANDLER ──────────────────────────────────────────────

/**
 * Processes user messages and returns Claude's response.
 * Rule 08 pattern: Zod → auth → user_id from session → logic → response.
 *
 * @param request - Request with JSON body containing message
 * @returns JSON with user and assistant messages
 * @throws Never throws — errors return appropriate HTTP status
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Step 1: Parse and validate request body (Rule 08)
    const body = await request.json()
    const parseResult = chatSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const { message } = parseResult.data

    // Step 2: Auth check (Rule 08)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ⚠️ CRITICAL: user_id from session — never from body (Rule 13)
    // Changing this allows any user to impersonate another.
    const userId = user.id

    // Step 3: Save user message to database
    const { data: userMessage, error: insertUserError } = await supabase
      .from('alma_messages')
      .insert({
        user_id: userId,
        role: 'user',
        content: message,
        channel: 'in-app',
      })
      .select()
      .single()

    if (insertUserError) {
      console.error('Failed to save user message:', insertUserError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Step 4: Fetch context (last N messages for Claude)
    // Why: 10 messages ≈ 2000 tokens. Keeps API costs manageable.
    const { data: contextData } = await supabase
      .from('alma_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_CONTEXT_MESSAGES)

    // Reverse to get chronological order for Claude
    const contextMessages = (contextData || []).reverse().map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    // Step 5: Fetch memory context for personalization
    const memoryContext = await getMemoryContext(userId)
    const enhancedSystemPrompt = ALMA_SYSTEM_PROMPT + memoryContext

    // Step 6: Call Claude API
    const anthropic = new Anthropic()
    const completion = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: enhancedSystemPrompt,
      messages: contextMessages,
    })

    // Extract response text
    const responseText = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    // Step 7: Save assistant message to database
    const { data: assistantMessage, error: insertAssistantError } = await supabase
      .from('alma_messages')
      .insert({
        user_id: userId,
        role: 'assistant',
        content: responseText,
        channel: 'in-app',
      })
      .select()
      .single()

    if (insertAssistantError) {
      console.error('Failed to save assistant message:', insertAssistantError)
    }

    // Step 8: Post-process for task extraction (non-blocking)
    // Why: Detect tasks mentioned in conversation for confirmation UI
    let extractedTasks = null
    if (hasTaskIntent(message)) {
      try {
        const extraction = await extractTasksFromConversation(message, responseText)
        if (extraction.hasTaskMention && extraction.tasks.length > 0) {
          extractedTasks = extraction.tasks
        }
      } catch (extractionError) {
        // Log but don't fail the response
        console.error('Task extraction error:', extractionError)
      }
    }

    // Step 9: Return both messages with optional extracted tasks
    return NextResponse.json({
      userMessage,
      assistantMessage,
      extractedTasks, // Array of tasks or null
    })
  } catch (err) {
    // Step 9: Catch-all error handler (Rule 08)
    // Generic message — never expose internals
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
