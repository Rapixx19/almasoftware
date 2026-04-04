// ============================================================
// ALMA · APP · brainstorm/page.tsx
// ============================================================
// What this file does: Full brainstorm/ideas page with capture and filtering
// Module: brainstorm — Ideas capture and organization
// Depends on: hooks/useIdeas, hooks/useMode, lucide-react
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Ideas hook for state, mode for elderly sizing, icons for UI.

import { useState, useRef } from 'react'
import { useIdeas, type IdeaType } from '@/hooks/useIdeas'
import { useMode } from '@/hooks/useMode'
import {
  Lightbulb,
  Mic,
  PenLine,
  Plus,
  Search,
  Trash2,
  MessageSquare,
  HelpCircle,
  CheckSquare,
  BookmarkIcon,
  Sparkles,
  X,
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface IdeaTypeConfig {
  label: string
  icon: React.ReactNode
  color: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const IDEA_TYPES: Record<IdeaType, IdeaTypeConfig> = {
  note: {
    label: 'Note',
    icon: <MessageSquare size={14} />,
    color: 'var(--text-secondary)',
  },
  question: {
    label: 'Question',
    icon: <HelpCircle size={14} />,
    color: 'var(--accent)',
  },
  action: {
    label: 'Action',
    icon: <CheckSquare size={14} />,
    color: 'var(--success)',
  },
  reference: {
    label: 'Reference',
    icon: <BookmarkIcon size={14} />,
    color: 'var(--purple)',
  },
  brainstorm: {
    label: 'Brainstorm',
    icon: <Sparkles size={14} />,
    color: 'var(--warm)',
  },
}

// ─── SUB-COMPONENTS ───────────────────────────────────────

function IdeaSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl p-4 animate-pulse"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <div
            className="h-4 rounded w-20 mb-2"
            style={{ backgroundColor: 'var(--bg-dim)' }}
          />
          <div
            className="h-3 rounded w-full mb-1"
            style={{ backgroundColor: 'var(--bg-dim)' }}
          />
          <div
            className="h-3 rounded w-3/4"
            style={{ backgroundColor: 'var(--bg-dim)' }}
          />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="p-6 rounded-full mb-4"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <Lightbulb size={40} style={{ color: 'var(--purple)' }} />
      </div>
      <h2
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {hasFilter ? 'No matching ideas' : 'Capture your first idea'}
      </h2>
      <p
        className="text-center max-w-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        {hasFilter
          ? 'Try adjusting your filters or search'
          : 'Quick thoughts, questions, or inspirations — all in one place'}
      </p>
    </div>
  )
}

function IdeaCard({
  idea,
  onDelete,
  isElderly,
}: {
  idea: ReturnType<typeof useIdeas>['ideas'][0]
  onDelete: (id: string) => void
  isElderly: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const config = IDEA_TYPES[idea.idea_type]
  const fontSize = isElderly ? '16px' : '14px'
  const smallSize = isElderly ? '13px' : '11px'

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 200))
    onDelete(idea.id)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      className="rounded-xl p-4 border group relative"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        opacity: isDeleting ? 0 : 1,
        transform: isDeleting ? 'translateX(-20px)' : 'translateX(0)',
        transition: 'opacity var(--duration-fast), transform var(--duration-fast)',
      }}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: 'var(--bg-dim)' }}
        aria-label="Delete idea"
      >
        <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{
            backgroundColor: 'var(--bg-dim)',
            color: config.color,
            fontSize: smallSize,
          }}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
        {idea.source === 'voice' && (
          <Mic size={12} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      {/* Content */}
      <p
        className="whitespace-pre-wrap break-words mb-2"
        style={{ fontSize, color: 'var(--text-primary)', lineHeight: 1.5 }}
      >
        {idea.content}
      </p>

      {/* Timestamp */}
      <p style={{ fontSize: smallSize, color: 'var(--text-muted)' }}>
        {formatTime(idea.created_at)}
      </p>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────

/**
 * Full brainstorm/ideas page with capture and filtering.
 * Supports voice input, search, and category filtering.
 *
 * @returns Brainstorm page component
 */
export default function BrainstormPage() {
  const {
    filteredIdeas,
    isLoading,
    error,
    createIdea,
    deleteIdea,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
  } = useIdeas()
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  const [isComposing, setIsComposing] = useState(false)
  const [newIdeaContent, setNewIdeaContent] = useState('')
  const [newIdeaType, setNewIdeaType] = useState<IdeaType>('note')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fontSize = isElderly ? '16px' : '14px'
  const buttonSize = isElderly ? 56 : 48

  const handleCreateIdea = async () => {
    if (!newIdeaContent.trim()) return

    await createIdea(newIdeaContent, newIdeaType)
    setNewIdeaContent('')
    setIsComposing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreateIdea()
    }
    if (e.key === 'Escape') {
      setIsComposing(false)
      setNewIdeaContent('')
    }
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <p style={{ color: 'var(--error)' }}>Failed to load ideas</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {error.message}
          </p>
        </div>
      </div>
    )
  }

  const hasFilter = filterType !== null || searchQuery.trim() !== ''

  return (
    <div className="flex flex-col min-h-full">
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            <Lightbulb size={24} style={{ color: 'var(--purple)' }} />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Ideas
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: 'var(--text-primary)', fontSize }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilterType(null)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: filterType === null ? 'var(--accent)' : 'var(--bg-surface)',
              color: filterType === null ? 'var(--text-on-accent)' : 'var(--text-primary)',
            }}
          >
            All
          </button>
          {(Object.keys(IDEA_TYPES) as IdeaType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === filterType ? null : type)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: filterType === type ? IDEA_TYPES[type].color : 'var(--bg-surface)',
                color: filterType === type ? 'white' : 'var(--text-primary)',
              }}
            >
              {IDEA_TYPES[type].icon}
              {IDEA_TYPES[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── IDEAS LIST ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 pt-2">
        {isLoading ? (
          <IdeaSkeleton />
        ) : filteredIdeas.length === 0 ? (
          <EmptyState hasFilter={hasFilter} />
        ) : (
          <div className="space-y-3">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={deleteIdea}
                isElderly={isElderly}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── INPUT AREA ───────────────────────────────────────── */}
      {isComposing ? (
        <div
          className="p-4 border-t"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {/* Type selector */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            {(Object.keys(IDEA_TYPES) as IdeaType[]).map((type) => (
              <button
                key={type}
                onClick={() => setNewIdeaType(type)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: newIdeaType === type ? IDEA_TYPES[type].color : 'var(--bg-dim)',
                  color: newIdeaType === type ? 'white' : 'var(--text-secondary)',
                }}
              >
                {IDEA_TYPES[type].icon}
                {IDEA_TYPES[type].label}
              </button>
            ))}
          </div>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={newIdeaContent}
            onChange={(e) => setNewIdeaContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            rows={3}
            autoFocus
            className="w-full rounded-xl p-3 resize-none outline-none mb-3"
            style={{
              backgroundColor: 'var(--bg-dim)',
              color: 'var(--text-primary)',
              fontSize,
            }}
          />

          {/* Action buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsComposing(false)
                setNewIdeaContent('')
              }}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--bg-dim)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateIdea}
              disabled={!newIdeaContent.trim()}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: newIdeaContent.trim() ? 'var(--purple)' : 'var(--bg-dim)',
                color: newIdeaContent.trim() ? 'white' : 'var(--text-muted)',
              }}
            >
              Save Idea
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-4 border-t"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {/* Input mode buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsComposing(true)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--bg-dim)' }}
            >
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: 'var(--purple)' }}
              >
                <PenLine size={20} style={{ color: 'white' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Type
              </span>
            </button>

            <button
              onClick={() => setIsComposing(true)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--bg-dim)' }}
            >
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Mic size={20} style={{ color: 'white' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Voice
              </span>
            </button>
          </div>

          {/* Quick add FAB */}
          <button
            onClick={() => setIsComposing(true)}
            className="fixed bottom-24 right-4 flex items-center justify-center rounded-full shadow-lg"
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: 'var(--purple)',
            }}
            aria-label="Quick add idea"
          >
            <Plus size={24} style={{ color: 'white' }} />
          </button>
        </div>
      )}

      {/* Scrollbar hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
