// ============================================================
// ALMA · COMPONENTS · HomePromptSuggestions.tsx
// ============================================================
// What this file does: Conversation starter prompt chips
// Module: screens — Home screen components
// Depends on: next/link, lucide-react
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import {
  Lightbulb,
  ListTodo,
  Wind,
  MessageCircle,
  BookOpen,
  Target,
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface Prompt {
  icon: typeof Lightbulb
  label: string
  query: string
}

interface HomePromptSuggestionsProps {
  className?: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const PROMPTS: Prompt[] = [
  { icon: Lightbulb, label: 'Brainstorm', query: 'Help me brainstorm an idea' },
  { icon: ListTodo, label: 'Plan my day', query: 'Help me plan my day' },
  { icon: Wind, label: 'Help me relax', query: 'Help me relax and unwind' },
  { icon: MessageCircle, label: 'Just chat', query: 'Let\'s have a conversation' },
  { icon: BookOpen, label: 'Learn', query: 'Teach me something new today' },
  { icon: Target, label: 'Set a goal', query: 'Help me set a meaningful goal' },
]

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Horizontal scrollable prompt suggestions inspired by Pi's Discover.
 * Tapping a prompt navigates to chat with the query pre-filled.
 *
 * @param className - Additional classes
 * @returns Prompt chips component
 */
export function HomePromptSuggestions({ className }: HomePromptSuggestionsProps) {
  return (
    <div className={cn('overflow-x-auto scrollbar-hide', className)}>
      <div className="flex gap-2 pb-1">
        {PROMPTS.map((prompt) => {
          const Icon = prompt.icon
          return (
            <Link
              key={prompt.label}
              href={`/app/brainstorm?prompt=${encodeURIComponent(prompt.query)}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full',
                'whitespace-nowrap transition-all',
                'hover:scale-105 active:scale-95',
                'focus:outline-none focus:ring-2'
              )}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)',
              } as React.CSSProperties}
            >
              <Icon
                size={16}
                style={{ color: 'var(--accent)' }}
              />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {prompt.label}
              </span>
            </Link>
          )
        })}
      </div>

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
