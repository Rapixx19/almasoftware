// ============================================================
// ALMA · HOOKS · useHomeData.ts
// ============================================================
// What this file does: Fetches all home screen data in parallel
// Module: home — Home screen data layer
// Depends on: lib/supabase/client.ts
// Used by: app/app/home/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── TYPES ────────────────────────────────────────────────

interface HomeStats {
  tasksCompletedToday: number
  memoriesCount: number
  daysActive: number
}

interface ActiveAlert {
  id: string
  title: string
  body: string | null
  priority: 'low' | 'normal' | 'high' | 'urgent'
}

interface UpcomingTask {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: Date | null
}

interface UpcomingEvent {
  id: string
  title: string
  startTime: Date
  endTime: Date
}

interface BriefItem {
  icon: 'calendar' | 'task' | 'memory' | 'greeting'
  text: string
}

interface HomeData {
  greeting: string
  userName: string
  stats: HomeStats
  activeAlert: ActiveAlert | null
  hubOnline: boolean
  hasLoggedMoodToday: boolean
  upcomingTasks: UpcomingTask[]
  upcomingEvents: UpcomingEvent[]
  briefItems: BriefItem[]
  isLoading: boolean
  error: Error | null
  dismissAlert: (id: string) => Promise<void>
  logMood: (mood: number) => Promise<void>
}

// ─── HELPERS ──────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDaysActive(createdAt: string | null): number {
  if (!createdAt) return 1
  const created = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

function formatEventTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function buildBriefItems(
  nextEvent: UpcomingEvent | null,
  highPriorityTaskCount: number,
  lastMemory: string | null
): BriefItem[] {
  const items: BriefItem[] = []

  if (nextEvent) {
    items.push({
      icon: 'calendar',
      text: `Next: ${nextEvent.title} at ${formatEventTime(nextEvent.startTime)}`,
    })
  }

  if (highPriorityTaskCount > 0) {
    items.push({
      icon: 'task',
      text: `${highPriorityTaskCount} high-priority task${highPriorityTaskCount > 1 ? 's' : ''} pending`,
    })
  }

  if (lastMemory) {
    const truncated = lastMemory.length > 50 ? lastMemory.slice(0, 50) + '...' : lastMemory
    items.push({
      icon: 'memory',
      text: `Last note: "${truncated}"`,
    })
  }

  // Always add a greeting if we have room
  if (items.length < 3) {
    const hour = new Date().getHours()
    const greetings = [
      'Ready to help you today',
      hour < 12 ? 'Start your day strong' : 'Keep up the momentum',
      'What would you like to accomplish?',
    ]
    const greetingIndex = Math.min(items.length, greetings.length - 1)
    items.push({
      icon: 'greeting',
      text: greetings[greetingIndex] ?? 'Ready to help you today',
    })
  }

  return items.slice(0, 3)
}

// ─── HOOK ─────────────────────────────────────────────────

/**
 * Fetches all home screen data in parallel.
 * Includes greeting, stats, active alert, mood, upcoming items, and hub status.
 */
export function useHomeData(): HomeData {
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState<HomeStats>({ tasksCompletedToday: 0, memoriesCount: 0, daysActive: 1 })
  const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null)
  const [hubOnline, setHubOnline] = useState(false)
  const [hasLoggedMoodToday, setHasLoggedMoodToday] = useState(false)
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [briefItems, setBriefItems] = useState<BriefItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        // Calculate date ranges
        const now = new Date()
        const today = new Date(now)
        today.setHours(0, 0, 0, 0)
        const todayISO = today.toISOString()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const weekEnd = new Date(today)
        weekEnd.setDate(weekEnd.getDate() + 7)

        // Fetch all data in parallel
        const [
          profileRes,
          tasksCompletedRes,
          memoriesRes,
          alertsRes,
          hubRes,
          moodRes,
          upcomingTasksRes,
          upcomingEventsRes,
          lastMemoryRes,
          highPriorityCountRes,
        ] = await Promise.all([
          supabase.from('users_profile').select('display_name, created_at').eq('id', user.id).single(),
          supabase.from('alma_tasks').select('id', { count: 'exact' })
            .eq('user_id', user.id).eq('status', 'completed').gte('completed_at', todayISO),
          supabase.from('alma_memory').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('alma_alerts').select('id, title, body, priority')
            .eq('user_id', user.id).is('read_at', null).order('created_at', { ascending: false }).limit(1),
          supabase.from('hub_status').select('is_online').eq('user_id', user.id).limit(1).single(),
          supabase.from('user_mood_logs').select('id')
            .eq('user_id', user.id).gte('logged_at', todayISO).limit(1),
          supabase.from('alma_tasks').select('id, title, priority, due_date')
            .eq('user_id', user.id).neq('status', 'completed').neq('status', 'cancelled')
            .lte('due_date', weekEnd.toISOString()).order('due_date', { ascending: true }).limit(5),
          supabase.from('alma_calendar_events').select('id, title, start_time, end_time')
            .eq('user_id', user.id).gte('start_time', now.toISOString())
            .order('start_time', { ascending: true }).limit(3),
          supabase.from('alma_memory').select('content')
            .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
          supabase.from('alma_tasks').select('id', { count: 'exact' })
            .eq('user_id', user.id).neq('status', 'completed').neq('status', 'cancelled')
            .in('priority', ['high', 'urgent']),
        ])

        if (!mounted) return

        // Process profile
        if (profileRes.data) {
          setUserName(profileRes.data.display_name || 'there')
          setStats(prev => ({ ...prev, daysActive: getDaysActive(profileRes.data.created_at) }))
        }

        // Process stats
        setStats(prev => ({
          ...prev,
          tasksCompletedToday: tasksCompletedRes.count || 0,
          memoriesCount: memoriesRes.count || 0,
        }))

        // Process alert
        if (alertsRes.data && alertsRes.data.length > 0) {
          setActiveAlert(alertsRes.data[0] as ActiveAlert)
        }

        // Process hub status
        if (hubRes.data) {
          setHubOnline(hubRes.data.is_online || false)
        }

        // Process mood
        setHasLoggedMoodToday(!!(moodRes.data && moodRes.data.length > 0))

        // Process upcoming tasks
        if (upcomingTasksRes.data) {
          setUpcomingTasks(upcomingTasksRes.data.map(t => ({
            id: t.id,
            title: t.title,
            priority: t.priority as UpcomingTask['priority'],
            dueDate: t.due_date ? new Date(t.due_date) : null,
          })))
        }

        // Process upcoming events
        if (upcomingEventsRes.data) {
          setUpcomingEvents(upcomingEventsRes.data.map(e => ({
            id: e.id,
            title: e.title,
            startTime: new Date(e.start_time),
            endTime: new Date(e.end_time),
          })))
        }

        // Build brief items
        const nextEvent = upcomingEventsRes.data?.[0]
          ? {
              id: upcomingEventsRes.data[0].id,
              title: upcomingEventsRes.data[0].title,
              startTime: new Date(upcomingEventsRes.data[0].start_time),
              endTime: new Date(upcomingEventsRes.data[0].end_time),
            }
          : null
        const lastMemoryContent = lastMemoryRes.data?.[0]?.content || null
        const highPriorityCount = highPriorityCountRes.count || 0

        setBriefItems(buildBriefItems(nextEvent, highPriorityCount, lastMemoryContent))

        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load home data'))
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [supabase])

  const dismissAlert = async (id: string) => {
    const { error: err } = await supabase
      .from('alma_alerts')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)

    if (!err) setActiveAlert(null)
  }

  const logMood = useCallback(async (mood: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase
      .from('user_mood_logs')
      .insert({ user_id: user.id, mood })

    if (!err) setHasLoggedMoodToday(true)
  }, [supabase])

  return {
    greeting: getGreeting(),
    userName,
    stats,
    activeAlert,
    hubOnline,
    hasLoggedMoodToday,
    upcomingTasks,
    upcomingEvents,
    briefItems,
    isLoading,
    error,
    dismissAlert,
    logMood,
  }
}
