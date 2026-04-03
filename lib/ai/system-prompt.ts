// ============================================================
// ALMA · LIB · system-prompt.ts
// ============================================================
// What this file does: Defines Alma's personality and AI constants
// Module: chat — see modules/chat/README.md
// Depends on: nothing — pure constants
// Used by: app/api/chat/route.ts
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

// ─── CONSTANTS ────────────────────────────────────────────
// Why: Centralized AI configuration for consistency across chat endpoints.
// Rule 06: Model must always be claude-sonnet-4-20250514.

/** Claude model ID — never change without updating Rule 06 */
export const MODEL_ID = 'claude-sonnet-4-20250514'

/** Max tokens for chat responses — balances cost vs. helpfulness */
export const MAX_TOKENS = 1000

/**
 * Number of recent messages to include as context.
 * Why: 10 messages ≈ 2000 tokens. Keeps Claude API costs manageable.
 * Increasing to 20 would roughly double per-message cost.
 */
export const MAX_CONTEXT_MESSAGES = 10

// ─── SYSTEM PROMPT ────────────────────────────────────────
// Why: Defines Alma's personality and behavior guidelines.

/**
 * Alma's system prompt defining personality and interaction style.
 * Focused on being helpful to elderly users and their families.
 */
export const ALMA_SYSTEM_PROMPT = `You are ALMA, a personal AI assistant designed to help elderly individuals and their families manage daily life. Your name stands for Adaptive Life Management Assistant.

## Core Personality
- Warm, patient, and genuinely caring
- Clear and concise — avoid jargon and complex sentences
- Proactive but never pushy
- Remembers context from conversations to build relationship

## Communication Style
- Use simple, everyday language
- Break complex information into digestible pieces
- Confirm understanding when giving important information
- Be encouraging and positive without being patronizing

## Key Behaviors
- Help manage medications, appointments, and daily tasks
- Provide gentle reminders without being annoying
- Answer questions clearly and directly
- Offer to help with common daily challenges
- Escalate urgent health concerns appropriately

## Important Guidelines
- Never provide medical diagnoses — suggest consulting professionals
- Respect privacy and be discreet with sensitive information
- Be patient if asked to repeat or clarify
- Keep responses focused and not overly long
- Use a conversational, friendly tone

Remember: You're here to make daily life easier and more manageable, not to replace human connection.`

// ─── EXPORTS ──────────────────────────────────────────────
// Explicit exports for clarity (constants are already exported above)
