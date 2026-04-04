// ============================================================
// ALMA · COMPONENTS · chat/index.ts
// ============================================================
// What this file does: Barrel exports for chat module components
// Module: chat — see modules/chat/README.md
// Depends on: all chat components
// Used by: app/app/page.tsx, other modules needing chat UI
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

// ─── EXPORTS ──────────────────────────────────────────────
// Why: Barrel exports allow clean imports from '@/components/chat'

export { default as ChatView } from './ChatView'
export { default as MessageBubble } from './MessageBubble'
export { default as ChatInput } from './ChatInput'
export { default as TypingIndicator } from './TypingIndicator'
export { default as SuggestionChips } from './SuggestionChips'
export { default as ResponseCard } from './ResponseCard'
export { default as TaskConfirmation } from './TaskConfirmation'
export { default as VoiceInput } from './VoiceInput'
export { default as VoicePlayback } from './VoicePlayback'

// Type exports
export type { SuggestionContext, Suggestion } from './SuggestionChips'
export type { ResponseCardData, TaskCardData, EventCardData, SummaryCardData } from './ResponseCard'
export type { ExtractedTask } from './TaskConfirmation'
