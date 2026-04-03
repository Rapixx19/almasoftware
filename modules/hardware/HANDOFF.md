# Hardware Bridge Handoff Contract

## Overview
This document defines the contract between the Alma web app and the Hardware Bridge (bridge.py running on Raspberry Pi).

## Command Polling Endpoint

### GET /api/hardware/commands
The bridge polls this endpoint every 5 seconds.

**Request Headers:**
```
Authorization: Bearer <device_token>
```

**Response:**
```json
{
  "commands": [
    {
      "id": "cmd_123",
      "type": "speak",
      "payload": {
        "text": "Good morning!",
        "voice_id": "..."
      }
    }
  ]
}
```

**Command Types:**
- `speak` — Text-to-speech output
- `display` — Update display content
- `led` — Control LED state

## Status Reporting Endpoint

### POST /api/hardware/status
The bridge reports status changes.

**Request Body:**
```json
{
  "device_id": "hub_001",
  "status": "online",
  "sensors": {
    "motion_detected": false,
    "ambient_light": 50
  }
}
```

## Important Notes
- Device tokens are separate from user auth tokens
- All commands must be idempotent (bridge may retry)
- Status updates should be throttled (max 1/second)

## Changes
Any changes to this contract must be coordinated with the hardware team.
Update both this file AND bridge.py simultaneously.
