// ============================================================
// ALMA · SERVICES · alert-service.ts
// ============================================================
// What this file does: Server-side alert CRUD operations
// Module: alerts — see modules/alerts/README.md
// Depends on: lib/supabase/server.ts, types/alma.ts
// Used by: app/api/alerts/route.ts, app/api/alerts/[id]/route.ts
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

import { createClient } from '@/lib/supabase/server'
import type { AlmaAlert, AlertSeverity } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

export interface CreateAlertInput {
  title: string
  body?: string | undefined
  severity?: AlertSeverity | undefined
  alert_type?: 'reminder' | 'task_due' | 'calendar' | 'system' | 'chat' | undefined
}

export interface AlertFilters {
  severity?: AlertSeverity
  is_dismissed?: boolean
  limit?: number
}

interface AlertRow {
  id: string
  user_id: string
  title: string
  body: string | null
  priority: string | null
  read_at: string | null
  snoozed_until: string | null
  created_at: string | null
}

// ─── HELPERS ──────────────────────────────────────────────

/** Maps DB priority to domain severity. */
function mapPriorityToSeverity(priority: string | null): AlertSeverity {
  if (priority === 'urgent') return 'urgent'
  if (priority === 'high' || priority === 'normal') return 'medium'
  return 'low'
}

/** Maps domain severity to DB priority. */
function mapSeverityToPriority(severity: AlertSeverity): string {
  if (severity === 'urgent') return 'urgent'
  if (severity === 'medium') return 'normal'
  return 'low'
}

function toAlmaAlert(row: AlertRow): AlmaAlert {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    body: row.body || '',
    severity: mapPriorityToSeverity(row.priority),
    is_dismissed: row.read_at !== null,
    snoozed_until: row.snoozed_until,
    created_at: row.created_at || new Date().toISOString(),
  }
}

// ─── SERVICE FUNCTIONS ────────────────────────────────────

/** Creates a new alert. userId from session (Rule 13). */
export async function createAlert(userId: string, data: CreateAlertInput): Promise<AlmaAlert> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('alma_alerts')
    .insert({
      user_id: userId,
      title: data.title,
      body: data.body || null,
      priority: data.severity ? mapSeverityToPriority(data.severity) : 'low',
      alert_type: data.alert_type || 'system',
      channel: 'in-app',
    })
    .select()
    .single()
  if (error) throw new Error(`Failed to create alert: ${error.message}`)
  return toAlmaAlert(row)
}

/** Fetches alerts with optional filters. userId from session (Rule 13). */
export async function getAlerts(userId: string, filters?: AlertFilters): Promise<AlmaAlert[]> {
  const supabase = await createClient()
  let query = supabase.from('alma_alerts').select('*').eq('user_id', userId)
  if (filters?.severity) {
    const priority = mapSeverityToPriority(filters.severity)
    if (filters.severity === 'urgent') {
      query = query.eq('priority', 'urgent')
    } else if (filters.severity === 'medium') {
      query = query.in('priority', ['normal', 'high'])
    } else {
      query = query.eq('priority', 'low')
    }
  }
  if (filters?.is_dismissed !== undefined) {
    query = filters.is_dismissed ? query.not('read_at', 'is', null) : query.is('read_at', null)
  }
  query = query.order('read_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
  if (filters?.limit) query = query.limit(filters.limit)
  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch alerts: ${error.message}`)
  return (data || []).map(toAlmaAlert)
}

/** Dismisses an alert by setting read_at. userId from session (Rule 13). */
export async function dismissAlert(userId: string, id: string): Promise<AlmaAlert> {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('alma_alerts')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw new Error(`Failed to dismiss alert: ${error.message}`)
  return toAlmaAlert(row)
}

/** Deletes an alert. userId from session (Rule 13). */
export async function deleteAlert(userId: string, id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('alma_alerts').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(`Failed to delete alert: ${error.message}`)
}

/** Snoozes an alert for specified minutes. userId from session (Rule 13). */
export async function snoozeAlert(userId: string, id: string, minutes: number): Promise<AlmaAlert> {
  const supabase = await createClient()
  const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()
  const { data: row, error } = await supabase
    .from('alma_alerts')
    .update({ snoozed_until: snoozedUntil })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw new Error(`Failed to snooze alert: ${error.message}`)
  return toAlmaAlert(row)
}

/** Fetches active alerts (non-dismissed, non-snoozed). userId from session (Rule 13). */
export async function getActiveAlerts(userId: string): Promise<AlmaAlert[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('alma_alerts')
    .select('*')
    .eq('user_id', userId)
    .is('read_at', null)
    .or(`snoozed_until.is.null,snoozed_until.lt.${now}`)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to fetch active alerts: ${error.message}`)
  return (data || []).map(toAlmaAlert)
}
