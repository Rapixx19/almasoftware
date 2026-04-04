// ============================================================
// ALMA · COMPONENTS · IntegrationItem.tsx
// ============================================================
// What this file does: Integration row with connect/disconnect state
// Module: screens — Settings screen components
// Depends on: nothing
// Used by: app/app/settings/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

'use client'

import type { LucideIcon } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface IntegrationItemProps {
  icon: LucideIcon
  name: string
  description: string
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Integration item showing connection status and actions.
 * Connected: green dot + "CONNECTED" label
 * Disconnected: "CONNECT" button with accent border
 *
 * @param icon - Lucide icon component
 * @param name - Integration name
 * @param description - Short description
 * @param isConnected - Current connection status
 * @param onConnect - Callback to connect
 * @param onDisconnect - Callback to disconnect
 * @returns Integration item component
 */
export function IntegrationItem({
  icon: Icon,
  name,
  description,
  isConnected,
  onConnect,
  onDisconnect,
}: IntegrationItemProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Left: Icon and Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
          style={{ backgroundColor: 'var(--bg-dim)' }}
        >
          <Icon size={20} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="text-sm font-medium truncate"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
            }}
          >
            {name}
          </span>
          <span
            className="text-xs truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {description}
          </span>
        </div>
      </div>

      {/* Right: Status or Button */}
      {isConnected ? (
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--bg-dim)' }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--success)' }}
          />
          <span
            className="text-xs uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
            }}
          >
            Connected
          </span>
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            backgroundColor: 'transparent',
          }}
        >
          Connect
        </button>
      )}
    </div>
  )
}
