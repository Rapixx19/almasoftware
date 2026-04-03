# Chat Module

## Purpose
Real-time chat interface with Claude AI integration.

## Exports
- `components/ChatView.tsx` — Chat interface
- `components/MessageBubble.tsx` — Individual message
- `hooks/useChat.ts` — Chat state and actions
- `api/chat/route.ts` — Chat API endpoint

## Dependencies
- `@anthropic-ai/sdk` — Claude API
- `modules/auth` — User session
- `modules/memory` — Context injection

## Used By
- Chat page
- Telegram integration

## Zone
YELLOW — Review required.
