// ============================================================
// ALMA · HOOKS · useTasks.ts
// ============================================================
// What this file does: Manages task state with realtime updates
// Module: tasks — see modules/tasks/README.md
// Depends on: lib/supabase/client.ts, types/alma.ts
// Used by: components/task/TaskList.tsx, app/app/tasks/page.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AlmaTask, TaskPriority } from '@/types/alma'

interface UseTasksReturn {
  tasks: AlmaTask[]
  isLoading: boolean
  error: Error | null
  createTask: (title: string, priority?: TaskPriority, dueDate?: string | null) => Promise<void>
  updateTask: (id: string, updates: { title?: string; priority?: TaskPriority; due_date?: string | null }) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (id: string) => Promise<void>
  filterPriority: TaskPriority | null
  setFilterPriority: (priority: TaskPriority | null) => void
  filterCompleted: boolean | null
  setFilterCompleted: (completed: boolean | null) => void
}

interface TaskRow {
  id: string
  user_id: string
  title: string
  priority: string | null
  status: string | null
  due_date: string | null
  created_at: string | null
  updated_at: string | null
}

function toAlmaTask(row: TaskRow): AlmaTask {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    priority: (row.priority as TaskPriority) || 'normal',
    is_completed: row.status === 'completed',
    due_date: row.due_date,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

/** Manages tasks with realtime updates and optimistic mutations. */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<AlmaTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null)
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !isMounted) return
        setUserId(user.id)
        const params = new URLSearchParams()
        if (filterPriority) params.set('priority', filterPriority)
        if (filterCompleted !== null) params.set('completed', String(filterCompleted))
        const url = params.toString() ? `/api/tasks?${params}` : '/api/tasks'
        const res = await fetch(url)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to fetch')
        if (isMounted) { setTasks(data.tasks || []); setIsLoading(false) }

        const channel = supabase
          .channel(`tasks-${user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'alma_tasks', filter: `user_id=eq.${user.id}` },
            (payload) => {
              if (!isMounted) return
              if (payload.eventType === 'INSERT') {
                const task = toAlmaTask(payload.new as TaskRow)
                setTasks((prev) => prev.some((t) => t.id === task.id) ? prev : [task, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                const task = toAlmaTask(payload.new as TaskRow)
                setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
              } else if (payload.eventType === 'DELETE') {
                setTasks((prev) => prev.filter((t) => t.id !== (payload.old as { id: string }).id))
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
  }, [supabase, filterPriority, filterCompleted])

  const createTask = useCallback(async (title: string, priority?: TaskPriority, dueDate?: string | null) => {
    if (!userId || !title.trim()) return
    const optId = `optimistic-${Date.now()}`
    const optTask: AlmaTask = { id: optId, user_id: userId, title: title.trim(), priority: priority || 'normal', is_completed: false, due_date: dueDate || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    setTasks((prev) => [optTask, ...prev]); setError(null)
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.trim(), priority, due_date: dueDate }) })
      const data = await res.json()
      if (!res.ok) { setTasks((prev) => prev.filter((t) => t.id !== optId)); throw new Error(data.error) }
      setTasks((prev) => prev.map((t) => (t.id === optId ? data.task : t)))
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to create')) }
  }, [userId])

  const updateTask = useCallback(async (id: string, updates: { title?: string; priority?: TaskPriority; due_date?: string | null }) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)); setError(null)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
      if (!res.ok) { const refetch = await fetch('/api/tasks'); setTasks((await refetch.json()).tasks || []); throw new Error('Failed to update') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to update')) }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const prev = tasks
    setTasks((p) => p.filter((t) => t.id !== id)); setError(null)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) { setTasks(prev); throw new Error('Failed to delete') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to delete')) }
  }, [tasks])

  const toggleComplete = useCallback(async (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, is_completed: !t.is_completed, updated_at: new Date().toISOString() } : t)); setError(null)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toggle_complete: true }) })
      if (!res.ok) { const refetch = await fetch('/api/tasks'); setTasks((await refetch.json()).tasks || []); throw new Error('Failed to toggle') }
    } catch (err) { setError(err instanceof Error ? err : new Error('Failed to toggle')) }
  }, [])

  return { tasks, isLoading, error, createTask, updateTask, deleteTask, toggleComplete, filterPriority, setFilterPriority, filterCompleted, setFilterCompleted }
}
