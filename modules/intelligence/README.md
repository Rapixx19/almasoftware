# Intelligence Module

## Purpose
External data integration and knowledge enrichment.

## Exports
- `services/scraper-sync.ts` — Sync from scraper database
- `services/enrichment.ts` — Data enrichment

## Dependencies
- Scraper Supabase credentials (server-only)
- `modules/memory` — Memory storage

## Used By
- Nightly sync jobs
- Agent context enrichment

## Zone
RED — Human review mandatory.
