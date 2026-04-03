# Hardware Module

## Purpose
Hardware bridge integration for Hub device communication.

## Exports
- `api/hardware/commands/route.ts` — Command polling endpoint
- `api/hardware/status/route.ts` — Status reporting endpoint

## Dependencies
- `modules/auth` — Device authentication
- `modules/alerts` — Alert triggers

## Used By
- Hardware bridge (bridge.py)
- Hub device

## Zone
RED — Human review mandatory.

## Handoff
See HANDOFF.md for hardware bridge contract.
