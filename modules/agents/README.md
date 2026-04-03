# Agents Module

## Purpose
Autonomous AI agents for background tasks and proactive actions.

## Exports
- `services/agent-runner.ts` — Agent execution
- `agents/daily-brief.ts` — Morning brief agent
- `agents/task-extractor.ts` — Extract tasks from chat

## Dependencies
- `@anthropic-ai/sdk` — Claude API
- `modules/memory` — Context
- `modules/tasks` — Task creation

## Used By
- Scheduled jobs
- Chat post-processing

## Zone
RED — Human review mandatory.
