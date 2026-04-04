// ============================================================
// ALMA · MODULES · tasks/index.ts
// ============================================================
// What this file does: Public exports for the Tasks module
// Module: tasks — see README.md
// Depends on: various tasks module files
// Used by: External consumers of the tasks module
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

// ─── SERVICE EXPORTS ─────────────────────────────────────
// Why: Server-side task operations for API routes.

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  type CreateTaskInput,
  type UpdateTaskInput,
  type TaskFilters,
} from '@/lib/services/task-service'

// ─── HOOK EXPORTS ────────────────────────────────────────
// Why: Client-side task management with realtime updates.

export { useTasks } from '@/hooks/useTasks'

// ─── COMPONENT EXPORTS ───────────────────────────────────
// Why: UI components for task display and management.

export { TaskCard, TaskList, TaskForm } from '@/components/task'
