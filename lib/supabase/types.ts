// ============================================================
// ALMA · LIB · types.ts
// ============================================================
// What this file does: Auto-generated Supabase database types
// Module: auth — see modules/auth/README.md
// Depends on: nothing — generated from Supabase schema
// Used by: lib/supabase/client.ts, lib/supabase/server.ts, all DB queries
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── TYPES ────────────────────────────────────────────────
// Why: Generated types ensure type-safe database operations.
// Regenerate with: MCP generate_typescript_types after schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alma_alerts: {
        Row: {
          alert_type: string | null
          body: string | null
          channel: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          priority: string | null
          read_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string | null
          body?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      alma_calendar_conflicts: {
        Row: {
          conflict_type: string | null
          created_at: string | null
          event_a_id: string
          event_b_id: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          user_id: string
        }
        Insert: {
          conflict_type?: string | null
          created_at?: string | null
          event_a_id: string
          event_b_id: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id: string
        }
        Update: {
          conflict_type?: string | null
          created_at?: string | null
          event_a_id?: string
          event_b_id?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alma_calendar_conflicts_event_a_id_fkey"
            columns: ["event_a_id"]
            isOneToOne: false
            referencedRelation: "alma_calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alma_calendar_conflicts_event_b_id_fkey"
            columns: ["event_b_id"]
            isOneToOne: false
            referencedRelation: "alma_calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      alma_calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          calendar_provider: string | null
          created_at: string | null
          description: string | null
          end_time: string
          external_id: string | null
          id: string
          location: string | null
          metadata: Json | null
          recurring_rule: string | null
          start_time: string
          synced_at: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          calendar_provider?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          external_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          recurring_rule?: string | null
          start_time: string
          synced_at?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          calendar_provider?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          external_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          recurring_rule?: string | null
          start_time?: string
          synced_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alma_ideas: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          idea_type: string | null
          metadata: Json | null
          project_id: string | null
          source: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          idea_type?: string | null
          metadata?: Json | null
          project_id?: string | null
          source?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          idea_type?: string | null
          metadata?: Json | null
          project_id?: string | null
          source?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alma_ideas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "alma_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      alma_memory: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          importance: number | null
          last_accessed_at: string | null
          memory_type: string | null
          source: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type?: string | null
          source?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          last_accessed_at?: string | null
          memory_type?: string | null
          source?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alma_messages: {
        Row: {
          channel: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          channel?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          channel?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      alma_projects: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          metadata: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alma_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          priority: string | null
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hub_commands: {
        Row: {
          command_type: string
          created_at: string | null
          error_message: string | null
          id: string
          payload: Json
          priority: number | null
          processed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          command_type: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload: Json
          priority?: number | null
          processed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          command_type?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json
          priority?: number | null
          processed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hub_events: {
        Row: {
          created_at: string | null
          event_type: string
          hub_id: string
          id: string
          payload: Json | null
          processed: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          hub_id: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          hub_id?: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      hub_status: {
        Row: {
          created_at: string | null
          firmware_version: string | null
          hub_id: string
          id: string
          ip_address: string | null
          is_online: boolean | null
          last_seen_at: string | null
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          firmware_version?: string | null
          hub_id: string
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          firmware_version?: string | null
          hub_id?: string
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          uses_remaining: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          uses_remaining?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          uses_remaining?: number | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_profile: {
        Row: {
          created_at: string | null
          current_mode: string | null
          display_name: string
          id: string
          mode_locked: boolean | null
          onboarding_complete: boolean | null
          telegram_chat_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_mode?: string | null
          display_name: string
          id: string
          mode_locked?: boolean | null
          onboarding_complete?: boolean | null
          telegram_chat_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_mode?: string | null
          display_name?: string
          id?: string
          mode_locked?: boolean | null
          onboarding_complete?: boolean | null
          telegram_chat_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      zapier_inbound_tokens: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          name: string
          permissions: Json | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          token?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      zapier_webhooks: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          metadata: Json | null
          name: string
          trigger_type: string
          updated_at: string | null
          user_id: string
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metadata?: Json | null
          name: string
          trigger_type: string
          updated_at?: string | null
          user_id: string
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          metadata?: Json | null
          name?: string
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ─── HELPER TYPES ─────────────────────────────────────────
// Why: Convenience types for common operations.

type DefaultSchema = Database["public"]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"]
