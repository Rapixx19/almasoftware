# Tasks Module

## Purpose
Task management with priorities, due dates, and completion tracking. Tasks can be created manually or extracted from chat conversations.

## Exports

### Services (Server-side)
- `createTask(userId, data)` — Create a new task
- `getTasks(userId, filters?)` — Fetch tasks with optional filters
- `updateTask(userId, id, data)` — Update an existing task
- `deleteTask(userId, id)` — Delete a task
- `toggleTaskComplete(userId, id)` — Toggle task completion status

### Hooks (Client-side)
- `useTasks()` — Returns `{ tasks, isLoading, error, createTask, updateTask, deleteTask, toggleComplete, filterPriority, setFilterPriority, filterCompleted, setFilterCompleted }`

### Components
- `TaskCard` — Single task display with completion toggle and edit/delete actions
- `TaskList` — Filterable list of tasks with status and priority tabs
- `TaskForm` — Modal form for creating new tasks

## API Routes

### `GET /api/tasks`
Fetch user's tasks with optional filters.
- Query params: `?priority=low|normal|high&completed=true|false`
- Returns: `{ tasks: AlmaTask[] }`

### `POST /api/tasks`
Create a new task.
- Body: `{ title: string, priority?: TaskPriority, due_date?: string|null, source?: 'chat'|'manual' }`
- Returns: `{ task: AlmaTask }`

### `PATCH /api/tasks/[id]`
Update an existing task.
- Body: `{ title?: string, priority?: TaskPriority, due_date?: string|null, is_completed?: boolean, toggle_complete?: boolean }`
- Returns: `{ task: AlmaTask }`

### `DELETE /api/tasks/[id]`
Delete a task.
- Returns: `204 No Content`

## Dependencies
- `modules/auth` — User session for authentication
- `modules/foundation` — AlmaTask and TaskPriority types

## Used By
- Tasks page — `/app/tasks`
- Home screen (upcoming tasks)

## Database Table
```sql
alma_tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,           -- 'low' | 'normal' | 'high'
  status TEXT,             -- 'pending' | 'completed'
  completed_at TIMESTAMP,
  due_date TIMESTAMP,
  source TEXT,             -- 'chat' | 'manual'
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Zone
YELLOW — Review required for service and hook files.

## Last Checkpoint
PHASE-06
