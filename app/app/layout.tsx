// ============================================================
// ALMA · APP · app/layout.tsx
// ============================================================
// What this file does: Wraps all /app/* routes with Shell
// Module: shell — see modules/shell/README.md
// Depends on: components/shell/Shell.tsx
// Used by: All authenticated app pages
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-02
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Shell provides mode-aware layout for all app routes.

import { Shell } from '@/components/shell'

// ─── TYPES ────────────────────────────────────────────────

interface AppLayoutProps {
  children: React.ReactNode
}

// ─── LAYOUT ───────────────────────────────────────────────
// Why: All /app/* routes share the same shell layout.

/**
 * Layout wrapper for authenticated app routes.
 * Renders Shell which provides StatusBar, BottomNav (standard)
 * or ElderlyShell layout based on user's mode setting.
 *
 * @param children - Page content
 * @returns Shell-wrapped layout
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return <Shell>{children}</Shell>
}
