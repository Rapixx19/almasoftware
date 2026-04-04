// ============================================================
// ALMA · APP · tasks/page.tsx
// ============================================================
// What this file does: Task management page
// Module: tasks — see modules/tasks/README.md
// Depends on: hooks/useTasks.ts, components/task/*
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-06
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMode } from '@/hooks/useMode'
import { useTasks } from '@/hooks/useTasks'
import { TaskList, TaskForm } from '@/components/task'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Task management page.
 * Displays list of tasks with filter and add functionality.
 */
export default function TasksPage() {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [showForm, setShowForm] = useState(false)

  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filterPriority,
    setFilterPriority,
    filterCompleted,
    setFilterCompleted,
  } = useTasks()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-bold"
          style={{
            fontSize: isElderly ? '28px' : '24px',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          Tasks
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
          }}
        >
          <Plus size={isElderly ? 22 : 18} />
          <span style={{ fontSize: isElderly ? '16px' : '14px' }}>Add</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div
          className="p-3 rounded-lg mb-4"
          style={{
            backgroundColor: 'var(--error)',
            color: 'white',
          }}
        >
          {error.message}
        </div>
      )}

      {/* Task list */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        filterPriority={filterPriority}
        filterCompleted={filterCompleted}
        onPriorityChange={setFilterPriority}
        onCompletedChange={setFilterCompleted}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onToggleComplete={toggleComplete}
      />

      {/* Add task form modal */}
      {showForm && (
        <TaskForm
          onSubmit={createTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
