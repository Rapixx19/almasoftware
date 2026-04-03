# Pipeline Module

## Purpose
Data pipeline for scheduled jobs and background processing.

## Exports
- `jobs/daily-sync.ts` — Daily data sync
- `jobs/morning-brief.ts` — Morning brief generation

## Dependencies
- `modules/intelligence` — Data fetching
- `modules/agents` — Agent execution

## Used By
- Cron jobs / scheduled tasks
- Background workers

## Zone
RED — Human review mandatory.
