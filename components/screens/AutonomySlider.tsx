// ============================================================
// ALMA · COMPONENTS · AutonomySlider.tsx
// ============================================================
// What this file does: Slider for autonomy level with zone labels
// Module: screens — Settings screen components
// Depends on: nothing
// Used by: app/app/settings/page.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

'use client'

import { useMemo } from 'react'

// ─── TYPES ────────────────────────────────────────────────

interface AutonomySliderProps {
  label: string
  value: number
  onChange: (value: number) => void
}

interface AutonomyZone {
  min: number
  max: number
  label: string
  description: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const AUTONOMY_ZONES: AutonomyZone[] = [
  {
    min: 0,
    max: 25,
    label: 'Suggest only',
    description: 'Alma recommends, you decide',
  },
  {
    min: 26,
    max: 50,
    label: 'Ask first',
    description: 'Alma asks before acting',
  },
  {
    min: 51,
    max: 75,
    label: 'Auto + notify',
    description: 'Alma acts, tells you after',
  },
  {
    min: 76,
    max: 100,
    label: 'Fully autonomous',
    description: 'Alma acts silently',
  },
]

// ─── HELPERS ──────────────────────────────────────────────

function getZone(value: number): AutonomyZone {
  const zone = AUTONOMY_ZONES.find((z) => value >= z.min && value <= z.max)
  // Fallback to first zone if not found (should never happen with valid 0-100 values)
  return zone ?? {
    min: 0,
    max: 25,
    label: 'Suggest only',
    description: 'Alma recommends, you decide',
  }
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Slider component for autonomy settings.
 * Shows current zone label and description based on value.
 *
 * @param label - Domain label (e.g., "Messages")
 * @param value - Current value (0-100)
 * @param onChange - Callback when value changes
 * @returns Autonomy slider component
 */
export function AutonomySlider({ label, value, onChange }: AutonomySliderProps) {
  const zone = useMemo(() => getZone(value), [value])

  return (
    <div className="space-y-3">
      {/* Header: Label and Zone */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </span>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {zone.label}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) ${value}%, var(--bg-dim) ${value}%)`,
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--accent);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          input[type='range']::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--accent);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>

      {/* Description */}
      <p
        className="text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {zone.description}
      </p>
    </div>
  )
}
