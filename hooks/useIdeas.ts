// ============================================================
// ALMA · HOOKS · useIdeas.ts
// ============================================================
// What this file does: Manages ideas/brainstorm state with realtime updates
// Module: brainstorm — see modules/brainstorm/README.md
// Depends on: lib/supabase/client.ts
// Used by: app/app/brainstorm/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Browser client for realtime, React hooks for state management.

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── TYPES ────────────────────────────────────────────────

export type IdeaType = 'note' | 'question' | 'action' | 'reference' | 'brainstorm'
export type IdeaSource = 'manual' | 'chat' | 'voice'

export interface AlmaIdea {
  id: string
  user_id: string
  project_id: string | null
  content: string
  idea_type: IdeaType
  source: IdeaSource
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

interface UseIdeasReturn {
  ideas: AlmaIdea[]
  isLoading: boolean
  error: Error | null
  createIdea: (content: string, type?: IdeaType, source?: IdeaSource) => Promise<AlmaIdea | null>
  updateIdea: (id: string, updates: { content?: string; idea_type?: IdeaType }) => Promise<void>
  deleteIdea: (id: string) => Promise<void>
  filterType: IdeaType | null
  setFilterType: (type: IdeaType | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredIdeas: AlmaIdea[]
}

// ─── DATABASE ROW TYPE ────────────────────────────────────

interface IdeaRow {
  id: string
  user_id: string
  project_id: string | null
  content: string
  idea_type: string | null
  source: string | null
  metadata: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
}

function toAlmaIdea(row: IdeaRow): AlmaIdea {
  return {
    id: row.id,
    user_id: row.user_id,
    project_id: row.project_id,
    content: row.content,
    idea_type: (row.idea_type as IdeaType) || 'note',
    source: (row.source as IdeaSource) || 'manual',
    metadata: row.metadata || {},
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

// ─── HOOK ─────────────────────────────────────────────────

/**
 * Manages ideas with realtime updates, filtering, and search.
 * CRUD operations with optimistic updates.
 *
 * @returns Ideas state and actions
 */
export function useIdeas(): UseIdeasReturn {
  const [ideas, setIdeas] = useState<AlmaIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filterType, setFilterType] = useState<IdeaType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  // Fetch ideas and subscribe to realtime updates
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return

        setUserId(user.id)

        // Fetch all ideas for this user
        const { data, error: fetchError } = await supabase
          .from('alma_ideas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw new Error(fetchError.message)

        if (isMounted) {
          setIdeas((data as IdeaRow[]).map(toAlmaIdea))
          setIsLoading(false)
        }

        // Subscribe to realtime changes
        const channel = supabase
          .channel(`ideas-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'alma_ideas',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (!isMounted) return

              if (payload.eventType === 'INSERT') {
                const idea = toAlmaIdea(payload.new as IdeaRow)
                setIdeas((prev) => {
                  const exists = prev.some((i) => i.id === idea.id)
                  return exists ? prev : [idea, ...prev]
                })
              } else if (payload.eventType === 'UPDATE') {
                const idea = toAlmaIdea(payload.new as IdeaRow)
                setIdeas((prev) => prev.map((i) => (i.id === idea.id ? idea : i)))
              } else if (payload.eventType === 'DELETE') {
                const deletedId = (payload.old as { id: string }).id
                setIdeas((prev) => prev.filter((i) => i.id !== deletedId))
              }
            }
          )
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load ideas'))
          setIsLoading(false)
        }
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [supabase])

  // Create a new idea
  const createIdea = useCallback(
    async (
      content: string,
      type: IdeaType = 'note',
      source: IdeaSource = 'manual'
    ): Promise<AlmaIdea | null> => {
      if (!userId || !content.trim()) return null

      const optimisticId = `optimistic-${Date.now()}`
      const optimisticIdea: AlmaIdea = {
        id: optimisticId,
        user_id: userId,
        project_id: null,
        content: content.trim(),
        idea_type: type,
        source,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Optimistic update
      setIdeas((prev) => [optimisticIdea, ...prev])
      setError(null)

      try {
        const { data, error: insertError } = await supabase
          .from('alma_ideas')
          .insert({
            user_id: userId,
            content: content.trim(),
            idea_type: type,
            source,
          })
          .select()
          .single()

        if (insertError) {
          // Rollback optimistic update
          setIdeas((prev) => prev.filter((i) => i.id !== optimisticId))
          throw new Error(insertError.message)
        }

        const newIdea = toAlmaIdea(data as IdeaRow)
        // Replace optimistic with real idea
        setIdeas((prev) => prev.map((i) => (i.id === optimisticId ? newIdea : i)))
        return newIdea
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create idea'))
        return null
      }
    },
    [userId, supabase]
  )

  // Update an existing idea
  const updateIdea = useCallback(
    async (id: string, updates: { content?: string; idea_type?: IdeaType }) => {
      if (!userId) return

      // Optimistic update
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, ...updates, updated_at: new Date().toISOString() }
            : i
        )
      )
      setError(null)

      try {
        const { error: updateError } = await supabase
          .from('alma_ideas')
          .update(updates)
          .eq('id', id)

        if (updateError) {
          // Refetch on error
          const { data } = await supabase
            .from('alma_ideas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          setIdeas((data as IdeaRow[] | null)?.map(toAlmaIdea) || [])
          throw new Error(updateError.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update idea'))
      }
    },
    [userId, supabase]
  )

  // Delete an idea
  const deleteIdea = useCallback(
    async (id: string) => {
      const previousIdeas = ideas

      // Optimistic delete
      setIdeas((prev) => prev.filter((i) => i.id !== id))
      setError(null)

      try {
        const { error: deleteError } = await supabase
          .from('alma_ideas')
          .delete()
          .eq('id', id)

        if (deleteError) {
          // Rollback
          setIdeas(previousIdeas)
          throw new Error(deleteError.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete idea'))
      }
    },
    [ideas, supabase]
  )

  // Filter ideas by type and search query
  const filteredIdeas = ideas.filter((idea) => {
    // Filter by type
    if (filterType && idea.idea_type !== filterType) {
      return false
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return idea.content.toLowerCase().includes(query)
    }

    return true
  })

  return {
    ideas,
    isLoading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    filteredIdeas,
  }
}
