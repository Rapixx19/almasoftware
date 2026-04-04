// ============================================================
// ALMA · COMPONENTS · task/index.ts
// ============================================================
// What this file does: Barrel exports for task components
// Module: tasks — see modules/tasks/README.md
// Depends on: nothing — pure exports
// Used by: app/app/tasks/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

// ─── EXPORTS ──────────────────────────────────────────────
// Why: Barrel exports simplify imports for consumers.

export { default as TaskCard } from './TaskCard'
export { default as TaskList } from './TaskList'
export { default as TaskForm } from './TaskForm'
