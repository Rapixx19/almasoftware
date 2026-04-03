# Chat Module

## Purpose
Real-time chat interface with Claude AI integration. Provides the primary communication channel between users and Alma.

## Exports

### Components (`components/chat/`)
- `ChatView` — Main chat interface with message list, input, and state management
- `MessageBubble` — Individual message bubble with role-based styling
- `ChatInput` — Text input with send button and keyboard handling
- `TypingIndicator` — Animated dots shown while Alma is responding

### Hooks (`hooks/`)
- `useChat` — Chat state management with realtime updates
  - Returns: `{ messages, isLoading, error, sendMessage, isTyping }`

### API (`app/api/chat/`)
- `POST /api/chat` — Send message and receive Claude response
  - Body: `{ message: string }`
  - Returns: `{ userMessage, assistantMessage }`

### AI Config (`lib/ai/`)
- `system-prompt.ts` — Alma's personality and AI constants
  - `MODEL_ID` — Claude model identifier
  - `MAX_TOKENS` — Response token limit
  - `MAX_CONTEXT_MESSAGES` — Context window size
  - `ALMA_SYSTEM_PROMPT` — Personality definition

## Dependencies
- `@anthropic-ai/sdk` — Claude API client
- `@supabase/supabase-js` — Database and realtime
- `modules/auth` — User session management

## Used By
- Chat page (`app/app/page.tsx`)
- Telegram integration (Phase 05)

## Database Tables
- `alma_messages` — Message storage with RLS

## Zone
YELLOW — Review required for changes to API route or hook.

## Last Updated
PHASE-03
