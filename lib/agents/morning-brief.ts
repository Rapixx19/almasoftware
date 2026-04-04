// ============================================================
// ALMA · LIB · agents/morning-brief.ts
// ============================================================
// What this file does: AI agent that generates personalized daily briefs
// Module: agents — AI agents for proactive intelligence
// Depends on: lib/supabase/server.ts, @anthropic-ai/sdk
// Used by: app/api/brief/route.ts
// Zone: RED
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'
import { SupabaseClient } from '@supabase/supabase-js'
import { MODEL_ID } from '@/lib/ai/system-prompt'

// ─── TYPES ────────────────────────────────────────────────

export interface BriefSection {
  type: 'greeting' | 'calendar' | 'tasks' | 'mood' | 'tip'
  icon: string
  title: string
  items: string[]
}

export interface MorningBrief {
  greeting: string
  userName: string
  sections: BriefSection[]
  generatedAt: string
  cached: boolean
}

interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  location: string | null
}

interface Task {
  id: string
  title: string
  priority: string
  due_date: string | null
}

interface MoodLog {
  mood: number
  logged_at: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const BRIEF_CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour
const MAX_EVENTS = 5
const MAX_TASKS = 5
const MAX_TOKENS = 500

// ─── HELPERS ──────────────────────────────────────────────

function getGreetingTime(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

function getAverageMood(logs: MoodLog[]): number {
  if (logs.length === 0) return 0
  const sum = logs.reduce((acc, log) => acc + log.mood, 0)
  return Math.round((sum / logs.length) * 10) / 10
}

function getMoodEmoji(mood: number): string {
  if (mood >= 4.5) return '😊'
  if (mood >= 3.5) return '🙂'
  if (mood >= 2.5) return '😐'
  if (mood >= 1.5) return '😕'
  return '😔'
}

// ─── DATA FETCHING ────────────────────────────────────────

async function fetchTodaysEvents(
  supabase: SupabaseClient,
  userId: string
): Promise<CalendarEvent[]> {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { data } = await supabase
    .from('alma_calendar_events')
    .select('id, title, start_time, end_time, location')
    .eq('user_id', userId)
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay)
    .order('start_time', { ascending: true })
    .limit(MAX_EVENTS)

  return (data as CalendarEvent[]) || []
}

async function fetchPendingTasks(
  supabase: SupabaseClient,
  userId: string
): Promise<Task[]> {
  const { data } = await supabase
    .from('alma_tasks')
    .select('id, title, priority, due_date')
    .eq('user_id', userId)
    .neq('status', 'completed')
    .neq('status', 'cancelled')
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(MAX_TASKS)

  return (data as Task[]) || []
}

async function fetchRecentMoods(
  supabase: SupabaseClient,
  userId: string
): Promise<MoodLog[]> {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data } = await supabase
    .from('user_mood_logs')
    .select('mood, logged_at')
    .eq('user_id', userId)
    .gte('logged_at', weekAgo.toISOString())
    .order('logged_at', { ascending: false })

  return (data as MoodLog[]) || []
}

async function fetchUserName(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data } = await supabase
    .from('users_profile')
    .select('display_name')
    .eq('id', userId)
    .single()

  return data?.display_name || 'there'
}

// ─── BRIEF GENERATION ─────────────────────────────────────

/**
 * Generates a personalized morning brief using Claude.
 * Combines calendar, tasks, and mood data into a friendly summary.
 *
 * @param supabase - Authenticated Supabase client
 * @param userId - User ID to generate brief for
 * @returns Structured morning brief data
 */
export async function generateMorningBrief(
  supabase: SupabaseClient,
  userId: string
): Promise<MorningBrief> {
  // Fetch all data in parallel
  const [userName, events, tasks, moods] = await Promise.all([
    fetchUserName(supabase, userId),
    fetchTodaysEvents(supabase, userId),
    fetchPendingTasks(supabase, userId),
    fetchRecentMoods(supabase, userId),
  ])

  const sections: BriefSection[] = []
  const greetingTime = getGreetingTime()

  // Calendar section
  if (events.length > 0) {
    sections.push({
      type: 'calendar',
      icon: '📅',
      title: `${events.length} event${events.length > 1 ? 's' : ''} today`,
      items: events.map((e) => {
        const time = formatTime(e.start_time)
        const location = e.location ? ` at ${e.location}` : ''
        return `${time} - ${e.title}${location}`
      }),
    })
  }

  // Tasks section
  if (tasks.length > 0) {
    const highPriority = tasks.filter((t) => t.priority === 'high' || t.priority === 'urgent')
    const hasDueToday = tasks.some((t) => {
      if (!t.due_date) return false
      const due = new Date(t.due_date)
      const today = new Date()
      return due.toDateString() === today.toDateString()
    })

    const title = highPriority.length > 0
      ? `${highPriority.length} priority task${highPriority.length > 1 ? 's' : ''}`
      : `${tasks.length} task${tasks.length > 1 ? 's' : ''} pending`

    sections.push({
      type: 'tasks',
      icon: '📋',
      title,
      items: tasks.slice(0, 3).map((t) => {
        const priority = t.priority === 'high' || t.priority === 'urgent' ? ' 🔴' : ''
        const due = t.due_date ? ` (${formatDate(t.due_date)})` : ''
        return `${t.title}${priority}${due}`
      }),
    })
  }

  // Mood section
  if (moods.length > 0) {
    const avgMood = getAverageMood(moods)
    const emoji = getMoodEmoji(avgMood)
    sections.push({
      type: 'mood',
      icon: '💭',
      title: `Mood this week: ${emoji} ${avgMood}/5`,
      items: [
        moods.length >= 5
          ? "You've been checking in regularly — great habit!"
          : 'How are you feeling today?',
      ],
    })
  }

  // Generate AI-enhanced greeting if we have context
  let greeting = `Good ${greetingTime}`

  if (events.length > 0 || tasks.length > 0) {
    try {
      const anthropic = new Anthropic()
      const context = [
        events.length > 0 ? `${events.length} calendar events today` : null,
        tasks.length > 0 ? `${tasks.length} pending tasks` : null,
        moods.length > 0 ? `average mood ${getAverageMood(moods)}/5 this week` : null,
      ].filter(Boolean).join(', ')

      const completion = await anthropic.messages.create({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        system: `You are Alma, a warm and caring AI assistant. Generate a brief, friendly one-sentence greeting for the user based on their day. Be encouraging but not overly enthusiastic. Keep it under 20 words.`,
        messages: [
          {
            role: 'user',
            content: `The user has: ${context}. Generate a warm ${greetingTime} greeting.`,
          },
        ],
      })

      const aiGreeting = completion.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim()

      if (aiGreeting && aiGreeting.length < 150) {
        greeting = aiGreeting
      }
    } catch (error) {
      // Fall back to simple greeting if AI fails
      console.error('AI greeting generation failed:', error)
    }
  }

  // Add a motivational tip occasionally
  if (Math.random() < 0.3) {
    const tips: string[] = [
      "Take a short walk today — it boosts creativity!",
      "Stay hydrated — your brain works better with water.",
      "A 5-minute stretch can help you focus.",
      "Remember to take breaks between tasks.",
      "Celebrate small wins today!",
    ]
    const randomIndex = Math.floor(Math.random() * tips.length)
    const randomTip = tips[randomIndex] as string // Safe: array has 5 items
    sections.push({
      type: 'tip',
      icon: '💡',
      title: 'Tip',
      items: [randomTip],
    })
  }

  return {
    greeting,
    userName,
    sections,
    generatedAt: new Date().toISOString(),
    cached: false,
  }
}

/**
 * Gets a cached brief or generates a new one if expired.
 * Uses metadata in users_profile to store cache.
 *
 * @param supabase - Authenticated Supabase client
 * @param userId - User ID
 * @returns Morning brief (cached or fresh)
 */
export async function getMorningBriefWithCache(
  supabase: SupabaseClient,
  userId: string
): Promise<MorningBrief> {
  // Check for cached brief in user profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('id')
    .eq('id', userId)
    .single()

  // For now, always generate fresh (caching can be added via Redis/KV later)
  // The plan mentions hybrid approach: generate on first home visit of day
  const brief = await generateMorningBrief(supabase, userId)

  return brief
}
