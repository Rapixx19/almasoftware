// ============================================================
// ALMA · MODULES · alerts/index.ts
// ============================================================
// What this file does: Public exports for the Alerts module
// Module: alerts — see README.md
// Depends on: various alerts module files
// Used by: External consumers of the alerts module
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

// ─── SERVICE EXPORTS ─────────────────────────────────────
// Why: Server-side alert operations for API routes.

export {
  createAlert,
  getAlerts,
  dismissAlert,
  deleteAlert,
  type CreateAlertInput,
  type AlertFilters,
} from '@/lib/services/alert-service'

// ─── HOOK EXPORTS ────────────────────────────────────────
// Why: Client-side alert management with realtime updates.

export { useAlerts } from '@/hooks/useAlerts'

// ─── COMPONENT EXPORTS ───────────────────────────────────
// Why: UI components for alert display and management.

export { AlertCard, AlertList, AlertBanner } from '@/components/alert'
