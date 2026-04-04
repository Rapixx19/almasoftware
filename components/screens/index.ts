// ============================================================
// ALMA · COMPONENTS · screens/index.ts
// ============================================================
// What this file does: Barrel export for screen components
// Module: screens — Home and Settings screen components
// Depends on: ./HomeBriefCard, ./HomeStatsRow, ./SettingsProfileCard, etc.
// Used by: app/app/home/page.tsx, app/app/settings/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

// Home screen components
export { HomeBriefCard } from './HomeBriefCard'
export { MorningBriefCard } from './MorningBriefCard'
export { HomeStatsRow } from './HomeStatsRow'
export { HomeAlertCard } from './HomeAlertCard'
export { HomeHubStrip } from './HomeHubStrip'
export { HomeQuickActions } from './HomeQuickActions'
export { HomeMoodCheck } from './HomeMoodCheck'
export { HomePromptSuggestions } from './HomePromptSuggestions'
export { HomeStreakBadge } from './HomeStreakBadge'
export { HomeUpcomingCard } from './HomeUpcomingCard'

// Settings screen components
export { SettingsProfileCard } from './SettingsProfileCard'
export { AutonomySlider } from './AutonomySlider'
export { IntegrationItem } from './IntegrationItem'
