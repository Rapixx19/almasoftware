// ============================================================
// ALMA · COMPONENTS · shell/index.ts
// ============================================================
// What this file does: Barrel exports for shell module
// Module: shell — see modules/shell/README.md
// Depends on: all shell components
// Used by: app/app/layout.tsx, any component needing shell exports
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── EXPORTS ──────────────────────────────────────────────
// Why: Single import point for all shell components.

export { Shell } from './Shell'
export { StatusBar } from './StatusBar'
export { BottomNav } from './BottomNav'
export { ElderlyShell } from './ElderlyShell'
export { SOSButton } from './SOSButton'
