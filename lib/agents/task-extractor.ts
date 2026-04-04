// ============================================================
// ALMA · LIB · agents/task-extractor.ts
// ============================================================
// What this file does: Extracts task information from chat messages using Claude
// Module: agents — AI agents for proactive intelligence
// Depends on: @anthropic-ai/sdk
// Used by: app/api/chat/route.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'
import { MODEL_ID } from '@/lib/ai/system-prompt'
import type { TaskPriority } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export interface ExtractedTask {
  title: string
  dueDate?: string        // Relative like "tomorrow" or ISO date
  priority?: TaskPriority
  confidence: number      // 0-1 confidence score
}

export interface ExtractionResult {
  tasks: ExtractedTask[]
  hasTaskMention: boolean
}

// ─── CONSTANTS ────────────────────────────────────────────

const MAX_TOKENS = 300

// Task extraction prompt
const EXTRACTION_PROMPT = `You are a task extraction assistant. Analyze the conversation and extract any tasks that the user mentioned wanting to do.

Rules:
1. Only extract EXPLICIT tasks the user wants to remember or do
2. Do NOT extract questions or general statements
3. Assign priority based on language urgency:
   - "urgent", "ASAP", "immediately" → high
   - "important", "need to", "must" → normal (default)
   - "maybe", "sometime", "when I can" → low
4. Extract due dates if mentioned (relative or absolute)
5. Return empty array if no clear tasks found
6. Confidence should be 0.9+ for explicit "remind me to..." or "add task..."
7. Confidence should be 0.6-0.8 for implied tasks
8. Confidence below 0.5 means don't include it

Respond ONLY with valid JSON in this format:
{
  "tasks": [
    {
      "title": "string - the task description",
      "dueDate": "string or null - relative (tomorrow, next week) or date",
      "priority": "low" | "normal" | "high",
      "confidence": number between 0 and 1
    }
  ]
}

Examples:
User: "remind me to call mom tomorrow"
→ {"tasks": [{"title": "Call mom", "dueDate": "tomorrow", "priority": "normal", "confidence": 0.95}]}

User: "I really need to submit that report by Friday, it's urgent"
→ {"tasks": [{"title": "Submit report", "dueDate": "Friday", "priority": "high", "confidence": 0.85}]}

User: "What's the weather like today?"
→ {"tasks": []}

User: "Maybe I should clean my room sometime"
→ {"tasks": [{"title": "Clean room", "dueDate": null, "priority": "low", "confidence": 0.55}]}
`

// ─── EXTRACTION FUNCTION ──────────────────────────────────

/**
 * Extracts tasks from a user message and Claude's response.
 * Uses conservative detection to avoid false positives.
 *
 * @param userMessage - The user's message
 * @param assistantResponse - Claude's response
 * @returns Extraction result with tasks and metadata
 */
export async function extractTasksFromConversation(
  userMessage: string,
  assistantResponse: string
): Promise<ExtractionResult> {
  // Quick filter: skip if message is too short or purely a question
  if (userMessage.length < 10 || userMessage.trim().endsWith('?')) {
    const isTaskQuestion = /remind|task|todo|add/i.test(userMessage)
    if (!isTaskQuestion) {
      return { tasks: [], hasTaskMention: false }
    }
  }

  // Keywords that suggest task intent
  const taskKeywords = [
    'remind', 'remember', 'task', 'todo', 'to-do', 'to do',
    'need to', 'have to', 'must', 'should', 'don\'t forget',
    'schedule', 'plan', 'deadline', 'due', 'by friday', 'by monday',
    'tomorrow', 'next week', 'urgent', 'important', 'asap',
    'call', 'email', 'meet', 'submit', 'finish', 'complete',
    'buy', 'pick up', 'get', 'send', 'book', 'make',
  ]

  const hasKeyword = taskKeywords.some((kw) =>
    userMessage.toLowerCase().includes(kw.toLowerCase())
  )

  if (!hasKeyword) {
    return { tasks: [], hasTaskMention: false }
  }

  try {
    const anthropic = new Anthropic()

    const completion = await anthropic.messages.create({
      model: MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this conversation for tasks:

User said: "${userMessage}"

Assistant responded: "${assistantResponse}"

Extract any tasks the user wants to remember or do.`,
        },
      ],
    })

    const responseText = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim()

    // Parse JSON response
    // Handle potential markdown code blocks
    let jsonText = responseText
    if (jsonText.includes('```')) {
      const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match && match[1]) {
        jsonText = match[1].trim()
      }
    }

    const parsed = JSON.parse(jsonText) as { tasks: ExtractedTask[] }

    // Filter tasks by confidence threshold
    const validTasks = parsed.tasks
      .filter((task) => task.confidence >= 0.5)
      .map((task) => ({
        ...task,
        // Normalize priority
        priority: (['low', 'normal', 'high'].includes(task.priority ?? '')
          ? task.priority
          : 'normal') as TaskPriority,
      }))

    return {
      tasks: validTasks,
      hasTaskMention: validTasks.length > 0,
    }
  } catch (error) {
    // Log error but don't fail the chat
    console.error('Task extraction failed:', error)
    return { tasks: [], hasTaskMention: false }
  }
}

/**
 * Simplified extraction for single user message (without response).
 * Used for quick pre-check before Claude responds.
 *
 * @param message - User message to check
 * @returns Whether the message likely contains task intent
 */
export function hasTaskIntent(message: string): boolean {
  const strongIndicators = [
    /remind me/i,
    /add (a )?task/i,
    /create (a )?task/i,
    /don't forget/i,
    /i need to/i,
    /i have to/i,
    /i must/i,
    /schedule/i,
    /by (tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /due (date|tomorrow|next)/i,
  ]

  return strongIndicators.some((pattern) => pattern.test(message))
}

/**
 * Formats a relative due date to a concrete date string.
 * Used when creating the actual task.
 *
 * @param relativeDue - Relative date string like "tomorrow"
 * @returns ISO date string or null
 */
export function parseRelativeDate(relativeDue?: string | null): string | null {
  if (!relativeDue) return null

  const lower = relativeDue.toLowerCase().trim()
  const today = new Date()

  // Today
  if (lower === 'today') {
    return today.toISOString()
  }

  // Tomorrow
  if (lower === 'tomorrow') {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString()
  }

  // Day names
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayIndex = days.findIndex((d) => lower.includes(d))
  if (dayIndex !== -1) {
    const currentDay = today.getDay()
    let daysUntil = dayIndex - currentDay
    if (daysUntil <= 0) daysUntil += 7 // Next occurrence
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + daysUntil)
    return targetDate.toISOString()
  }

  // Next week
  if (lower.includes('next week')) {
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toISOString()
  }

  // End of week (Friday)
  if (lower.includes('end of week') || lower.includes('this week')) {
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7
    const friday = new Date(today)
    friday.setDate(friday.getDate() + daysUntilFriday)
    return friday.toISOString()
  }

  // Try to parse as date directly
  try {
    const parsed = new Date(relativeDue)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  } catch {
    // Not a valid date
  }

  return null
}
