// ============================================================
// ALMA · SERVICES · settings-service.ts
// ============================================================
// What this file does: Server-side settings CRUD operations
// Module: settings — user autonomy and preferences
// Depends on: lib/supabase/server.ts, types/alma.ts
// Used by: app/api/settings/autonomy/route.ts
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

import { createClient } from '@/lib/supabase/server'
import type { AutonomyKey, AutonomySettings, UserProfile } from '@/types/alma'

// ─── CONSTANTS ───────────────────────────────────────────

/** Default autonomy values for new users */
const DEFAULT_AUTONOMY: AutonomySettings = {
  messages: 50,
  calendar: 50,
  smart_home: 50,
}

/** Allowlist of valid autonomy keys (security: prevents JSON injection) */
const ALLOWED_AUTONOMY_KEYS: Set<AutonomyKey> = new Set([
  'messages',
  'calendar',
  'smart_home',
])

// ─── TYPES ────────────────────────────────────────────────

interface ProfileRow {
  id: string
  display_name: string | null
  timezone: string | null
  current_mode: string | null
  autonomy_settings: AutonomySettings | null
  created_at: string | null
  updated_at: string | null
}

// ─── HELPERS ──────────────────────────────────────────────

/**
 * Validates that a key is in the autonomy allowlist.
 * Prevents injection attacks on JSONB column.
 */
export function isValidAutonomyKey(key: string): key is AutonomyKey {
  return ALLOWED_AUTONOMY_KEYS.has(key as AutonomyKey)
}

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    display_name: row.display_name || '',
    timezone: row.timezone || 'UTC',
    mode: (row.current_mode as 'standard' | 'elderly') || 'standard',
    autonomy_settings: row.autonomy_settings,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────

/**
 * Fetches user's autonomy settings.
 * Returns defaults if null in database.
 * userId from session (Rule 13).
 */
export async function getAutonomySettings(userId: string): Promise<AutonomySettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users_profile')
    .select('autonomy_settings')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch autonomy settings: ${error.message}`)
  }

  // Return stored settings or defaults
  return (data?.autonomy_settings as unknown as AutonomySettings) || DEFAULT_AUTONOMY
}

/**
 * Updates a single autonomy setting.
 * Key validated against allowlist. Value must be 0-100.
 * userId from session (Rule 13).
 */
export async function updateAutonomySetting(
  userId: string,
  key: AutonomyKey,
  value: number
): Promise<AutonomySettings> {
  // Validate key against allowlist (prevents JSON injection)
  if (!isValidAutonomyKey(key)) {
    throw new Error(`Invalid autonomy key: ${key}`)
  }

  // Validate value range
  if (value < 0 || value > 100 || !Number.isInteger(value)) {
    throw new Error('Value must be an integer between 0 and 100')
  }

  const supabase = await createClient()

  // First get current settings
  const current = await getAutonomySettings(userId)

  // Merge with new value
  const updated: AutonomySettings = {
    ...current,
    [key]: value,
  }

  // Update in database (cast for JSONB compatibility)
  const { error } = await supabase
    .from('users_profile')
    .update({ autonomy_settings: JSON.parse(JSON.stringify(updated)) })
    .eq('id', userId)

  if (error) {
    throw new Error(`Failed to update autonomy settings: ${error.message}`)
  }

  return updated
}

/**
 * Fetches user profile with all settings.
 * userId from session (Rule 13).
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return toUserProfile(data as unknown as ProfileRow)
}
