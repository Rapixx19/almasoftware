// ============================================================
// ALMA · COMPONENTS · SettingsProfileCard.tsx
// ============================================================
// What this file does: Profile card showing user info with initials avatar
// Module: screens — Settings screen components
// Depends on: nothing
// Used by: app/app/settings/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

'use client'

// ─── TYPES ────────────────────────────────────────────────

interface SettingsProfileCardProps {
  displayName: string
  role?: string | undefined
  country?: string | undefined
}

// ─── HELPERS ──────────────────────────────────────────────

/**
 * Extracts initials from a display name.
 * Returns first letter of first two words, or first two letters if single word.
 */
function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'U'
  const words = trimmed.split(/\s+/)
  if (words.length >= 2 && words[0] && words[1]) {
    return ((words[0][0] || '') + (words[1][0] || '')).toUpperCase()
  }
  return trimmed.slice(0, 2).toUpperCase()
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Profile card displaying user avatar, name, role, and country.
 * Avatar shows initials in a 56px circle with accent background.
 *
 * @param displayName - User's display name
 * @param role - Optional role/title
 * @param country - Optional country
 * @returns Profile card component
 */
export function SettingsProfileCard({
  displayName,
  role,
  country,
}: SettingsProfileCardProps) {
  const initials = getInitials(displayName || 'User')
  const subtitle = [role, country].filter(Boolean).join(' · ')

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Initials Avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 56,
          height: 56,
          backgroundColor: 'var(--accent)',
        }}
      >
        <span
          className="text-lg font-bold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--bg-base)',
          }}
        >
          {initials}
        </span>
      </div>

      {/* Name and Subtitle */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-lg font-bold truncate"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          {displayName || 'User'}
        </span>
        {subtitle && (
          <span
            className="text-sm truncate"
            style={{ color: 'var(--text-secondary)' }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
