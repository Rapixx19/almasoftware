# Memory Module

## Purpose
Store and retrieve user memories for personalized AI interactions. Memories provide context to Claude about user preferences, facts, relationships, routines, and health information.

## Exports

### Services (Server-side)
- `createMemory(userId, data)` — Create a new memory
- `getMemories(userId, filters?)` — Fetch memories with optional filters
- `updateMemory(userId, id, data)` — Update an existing memory
- `deleteMemory(userId, id)` — Delete a memory
- `getRelevantMemories(userId, limit?)` — Fetch top memories by importance

### Hooks (Client-side)
- `useMemories()` — Returns `{ memories, isLoading, error, createMemory, updateMemory, deleteMemory, filterCategory, setFilterCategory }`

### Components
- `MemoryCard` — Single memory display with edit/delete actions
- `MemoryList` — Filterable list of memories with category tabs
- `MemoryForm` — Modal form for creating new memories

### Chat Integration
- `getMemoryContext(userId)` — Returns formatted memory string for system prompt injection

## API Routes

### `GET /api/memories`
Fetch user's memories with optional category filter.
- Query params: `?category=preference|fact|relationship|routine|health|other`
- Returns: `{ memories: AlmaMemory[] }`

### `POST /api/memories`
Create a new memory.
- Body: `{ content: string, category: MemoryCategory, source?: 'chat'|'manual' }`
- Returns: `{ memory: AlmaMemory }`

### `PATCH /api/memories/[id]`
Update an existing memory.
- Body: `{ content?: string, category?: MemoryCategory }`
- Returns: `{ memory: AlmaMemory }`

### `DELETE /api/memories/[id]`
Delete a memory.
- Returns: `204 No Content`

## Dependencies
- `modules/auth` — User session for authentication
- `modules/foundation` — AlmaMemory and MemoryCategory types

## Used By
- Chat module — Memories injected into system prompt for personalized responses
- Memory management page — `/app/memories`

## Database Table
```sql
alma_memory (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  memory_type TEXT,       -- Maps to MemoryCategory
  importance FLOAT,       -- 0-1 relevance score
  source TEXT,            -- 'chat' | 'manual'
  last_accessed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Zone
YELLOW — Review required for service and hook files.

## Last Checkpoint
PHASE-05
