// ============================================================
// ALMA · COMPONENTS · MorningBriefCard.tsx
// ============================================================
// What this file does: AI-powered morning brief with expandable sections
// Module: screens — Home screen components
// Depends on: hooks/useMode, lucide-react
// Used by: app/app/home/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useMode } from '@/hooks/useMode'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  Calendar,
  CheckSquare,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { BriefSection, MorningBrief } from '@/lib/agents/morning-brief'

// ─── TYPES ────────────────────────────────────────────────

interface MorningBriefCardProps {
  /** Pre-fetched brief data (optional, will fetch if not provided) */
  brief?: MorningBrief | null
  /** Loading state */
  isLoading?: boolean
  /** Error message */
  error?: string | null
  /** Callback to refresh the brief */
  onRefresh?: () => void
}

// ─── HELPERS ──────────────────────────────────────────────

function getSectionIcon(type: BriefSection['type']) {
  const iconProps = { size: 16, style: { flexShrink: 0 } }
  switch (type) {
    case 'calendar':
      return <Calendar {...iconProps} style={{ ...iconProps.style, color: 'var(--accent)' }} />
    case 'tasks':
      return <CheckSquare {...iconProps} style={{ ...iconProps.style, color: 'var(--warm)' }} />
    case 'mood':
      return <Brain {...iconProps} style={{ ...iconProps.style, color: 'var(--purple)' }} />
    case 'tip':
      return <Lightbulb {...iconProps} style={{ ...iconProps.style, color: 'var(--gold)' }} />
    default:
      return <Sparkles {...iconProps} style={{ ...iconProps.style, color: 'var(--text-muted)' }} />
  }
}

// ─── SUB-COMPONENTS ───────────────────────────────────────

function BriefSectionCard({
  section,
  isExpanded,
  onToggle,
  isElderly,
}: {
  section: BriefSection
  isExpanded: boolean
  onToggle: () => void
  isElderly: boolean
}) {
  const fontSize = isElderly ? '15px' : '13px'
  const headerSize = isElderly ? '14px' : '12px'

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--border-light)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <span
            className="font-medium"
            style={{ fontSize: headerSize, color: 'var(--text-primary)' }}
          >
            {section.title}
          </span>
        </div>
        {section.items.length > 1 && (
          isExpanded ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )
        )}
      </button>

      {/* Items */}
      <div
        className="overflow-hidden transition-all"
        style={{
          maxHeight: isExpanded ? `${section.items.length * 32}px` : '0',
          opacity: isExpanded ? 1 : 0,
          transition: 'max-height var(--duration-normal), opacity var(--duration-fast)',
        }}
      >
        <ul className="pb-3 space-y-1">
          {section.items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 px-1"
              style={{ fontSize, color: 'var(--text-secondary)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────

/**
 * AI-powered morning brief card with expandable sections.
 * Fetches brief from API and displays with animations.
 *
 * @param brief - Pre-fetched brief data
 * @param isLoading - Show skeleton state
 * @param error - Error message to display
 * @param onRefresh - Callback to refresh the brief
 * @returns Morning brief card component
 */
export function MorningBriefCard({
  brief,
  isLoading,
  error,
  onRefresh,
}: MorningBriefCardProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-expand first section
  useEffect(() => {
    if (brief?.sections.length) {
      setExpandedSections(new Set([0]))
    }
  }, [brief])

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <p style={{ color: 'var(--error)', fontSize: '14px' }}>
            Failed to load brief
          </p>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full"
              style={{ backgroundColor: 'var(--bg-dim)' }}
            >
              <RefreshCw size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
      </Card>
    )
  }

  // No brief yet
  if (!brief) {
    return (
      <Card className="mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Ready to help you today
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
        >
          Today
        </h3>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-full transition-transform"
            style={{
              backgroundColor: 'var(--bg-dim)',
              transform: isRefreshing ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--duration-slow)',
            }}
            aria-label="Refresh brief"
          >
            <RefreshCw
              size={12}
              style={{ color: 'var(--text-muted)' }}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </button>
        )}
      </div>

      {/* AI Greeting */}
      <p
        className="mb-3"
        style={{
          fontSize: isElderly ? '16px' : '14px',
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}
      >
        {brief.greeting}
      </p>

      {/* Sections */}
      {brief.sections.length > 0 && (
        <div className="mt-2">
          {brief.sections.map((section, index) => (
            <BriefSectionCard
              key={index}
              section={section}
              isExpanded={expandedSections.has(index)}
              onToggle={() => toggleSection(index)}
              isElderly={isElderly}
            />
          ))}
        </div>
      )}

      {/* Cache indicator (subtle) */}
      {brief.cached && (
        <p
          className="text-right mt-2"
          style={{ fontSize: '10px', color: 'var(--text-muted)' }}
        >
          Updated recently
        </p>
      )}
    </Card>
  )
}
