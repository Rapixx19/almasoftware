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
