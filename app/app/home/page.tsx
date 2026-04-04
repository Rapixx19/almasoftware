// ============================================================
// ALMA · APP · home/page.tsx
// ============================================================
// What this file does: Enhanced home screen with bento grid layout
// Module: home — Home screen
// Depends on: hooks/useHomeData, components/alma, components/screens
// Used by: app router at /app/home
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { useRouter } from 'next/navigation'
import { AlmaOrb } from '@/components/alma'
import {
  HomeBriefCard,
  HomeStatsRow,
  HomeAlertCard,
  HomeHubStrip,
  HomeQuickActions,
  HomeMoodCheck,
  HomePromptSuggestions,
  HomeStreakBadge,
  HomeUpcomingCard,
} from '@/components/screens'
import { Card } from '@/components/ui/Card'
import { useHomeData } from '@/hooks/useHomeData'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Enhanced home screen with bento grid layout.
 * Hero section with interactive orb, mood check, prompts.
 * Grid section with upcoming items and stats.
 *
 * @returns Home page component
 */
export default function HomePage() {
  const router = useRouter()
  const {
    greeting,
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
  } = useHomeData()

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <Card variant="warm" className="text-center py-8">
          <p style={{ color: 'var(--text-primary)' }}>
            Failed to load home data
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {error.message}
          </p>
        </Card>
      </div>
    )
  }

  const handleOrbClick = () => {
    router.push('/app/brainstorm')
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <div className="p-4 pb-2">
        {/* Alma Orb and Greeting */}
        <div className="flex flex-col items-center mb-4">
          <AlmaOrb
            size="xl"
            status="active"
            onClick={handleOrbClick}
            showParticles
          />
          <h1
            className="text-xl font-medium mt-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {isLoading ? 'Hello' : `${greeting}, ${userName}`}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Tap to start chatting
          </p>

          {/* Streak Badge */}
          {stats.daysActive > 1 && (
            <HomeStreakBadge streak={stats.daysActive} className="mt-3" />
          )}
        </div>

        {/* Mood Check (shows once per day) */}
        <HomeMoodCheck
          onMoodSelect={logMood}
          hasLoggedToday={hasLoggedMoodToday}
          isLoading={isLoading}
          className="mb-4"
        />

        {/* Prompt Suggestions */}
        <HomePromptSuggestions className="mb-4" />
      </div>

      {/* ─── CONTENT SECTION ───────────────────────────────── */}
      <div className="flex-1 p-4 pt-2">
        {/* Hub Status */}
        <HomeHubStrip isOnline={hubOnline} />

        {/* Active Alert */}
        {activeAlert && (
          <HomeAlertCard
            id={activeAlert.id}
            title={activeAlert.title}
            body={activeAlert.body}
            priority={activeAlert.priority}
            onDismiss={dismissAlert}
          />
        )}

        {/* ─── BENTO GRID ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Upcoming Card */}
          <HomeUpcomingCard
            tasks={upcomingTasks}
            events={upcomingEvents}
            isLoading={isLoading}
          />

          {/* Stats Card - vertical layout */}
          <Card>
            <h3
              className="text-sm font-medium mb-3"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
            >
              Your Week
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>Done today</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
                >
                  {isLoading ? '—' : stats.tasksCompletedToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>Memories</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
                >
                  {isLoading ? '—' : stats.memoriesCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>Days active</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
                >
                  {isLoading ? '—' : stats.daysActive}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Morning Brief */}
        <HomeBriefCard items={briefItems} isLoading={isLoading} />

        {/* Quick Actions */}
        <HomeQuickActions />
      </div>
    </div>
  )
}
