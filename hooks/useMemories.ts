// ============================================================
// ALMA · HOOKS · useMemories.ts
// ============================================================
// What this file does: Manages memory state with realtime updates
// Module: memory — see modules/memory/README.md
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: components/memory/MemoryList.tsx, app/app/memories/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-05
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlmaMemory, MemoryCategory } from '@/types/alma'

interface UseMemoriesReturn {
  memories: AlmaMemory[]
  isLoading: boolean
  error: Error | null
  createMemory: (content: string, category: MemoryCategory) => Promise<void>
  updateMemory: (id: string, updates: { content?: string; category?: MemoryCategory }) => Promise<void>
  deleteMemory: (id: string) => Promise<void>
  filterCategory: MemoryCategory | null
  setFilterCategory: (category: MemoryCategory | null) => void
}

interface MemoryRow {
  id: string
  user_id: string
  content: string
  memory_type: string | null
  created_at: string | null
  updated_at: string | null
}

function toAlmaMemory(row: MemoryRow): AlmaMemory {
  return {
    id: row.id,
    user_id: row.user_id,
    category: (row.memory_type as MemoryCategory) || 'other',
    content: row.content,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

/** Manages memories with realtime updates and optimistic mutations. */
export function useMemories(): UseMemoriesReturn {
  const [memories, setMemories] = useState<AlmaMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filterCategory, setFilterCategory] = useState<MemoryCategory | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return
        setUserId(user.id)
        const url = filterCategory ? `/api/memories?category=${filterCategory}` : '/api/memories'
        const res = await fetch(url)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch')
        if (isMounted) { setMemories(data.memories || []); setIsLoading(false) }

        const channel = supabase
          .channel(`memories-${user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'alma_memory', filter: `user_id=eq.${user.id}` },
            (payload) => {
              if (!isMounted) return
              if (payload.eventType === 'INSERT') {
                const mem = toAlmaMemory(payload.new as MemoryRow)
                setMemories((prev) => prev.some((m) => m.id === mem.id) ? prev : [mem, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                const mem = toAlmaMemory(payload.new as MemoryRow)
                setMemories((prev) => prev.map((m) => (m.id === mem.id ? mem : m)))
              } else if (payload.eventType === 'DELETE') {
                setMemories((prev) => prev.filter((m) => m.id !== (payload.old as { id: string }).id))
              }
            })
          .subscribe()
        return () => { channel.unsubscribe() }
      } catch (err) {
        if (isMounted) { setError(err instanceof Error ? err : new Error('Failed to load')); setIsLoading(false) }
      }
    }
    init()
    return () => { isMounted = false }
  }, [supabase, filterCategory])

  const createMemory = useCallback(async (content: string, category: MemoryCategory) => {
    if (!userId || !content.trim()) return
    const optId = `optimistic-${Date.now()}`
    const optMem: AlmaMemory = { id: optId, user_id: userId, content: content.trim(), category, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    setMemories((prev) => [optMem, ...prev]); setError(null)
    try {
      const res = await fetch('/api/memories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.trim(), category }) })
      const data = await res.json()
      if (!res.ok) { setMemories((prev) => prev.filter((m) => m.id !== optId)); throw new Error(data.error) }
      setMemories((prev) => prev.map((m) => (m.id === optId ? data.memory : m)))
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to create')) }
  }, [userId])

  const updateMemory = useCallback(async (id: string, updates: { content?: string; category?: MemoryCategory }) => {
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m)); setError(null)
    try {
      const res = await fetch(`/api/memories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
      if (!res.ok) { const refetch = await fetch('/api/memories'); setMemories((await refetch.json()).memories || []); throw new Error('Failed to update') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to update')) }
  }, [])

  const deleteMemory = useCallback(async (id: string) => {
    const prev = memories
    setMemories((p) => p.filter((m) => m.id !== id)); setError(null)
    try {
      const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' })
      if (!res.ok) { setMemories(prev); throw new Error('Failed to delete') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to delete')) }
  }, [memories])

  return { memories, isLoading, error, createMemory, updateMemory, deleteMemory, filterCategory, setFilterCategory }
}
