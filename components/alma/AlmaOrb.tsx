// ============================================================
// ALMA · COMPONENTS · AlmaOrb.tsx
// ============================================================
// What this file does: Interactive orb with particles and tap animation
// Module: alma — Alma identity components
// Depends on: lib/utils/cn.ts
// Used by: Home screen, status displays
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-04
// ============================================================

'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── TYPES ────────────────────────────────────────────────

type OrbSize = 'sm' | 'md' | 'lg' | 'xl'
type OrbStatus = 'active' | 'thinking' | 'alert' | 'offline'

interface AlmaOrbProps {
  size?: OrbSize
  status?: OrbStatus
  onClick?: () => void
  showParticles?: boolean
  className?: string
}

// ─── CONSTANTS ────────────────────────────────────────────

const SIZE_MAP: Record<OrbSize, number> = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
}

const STATUS_COLORS: Record<OrbStatus, string> = {
  active: 'var(--accent)',
  thinking: 'var(--purple)',
  alert: 'var(--warm)',
  offline: 'var(--text-muted)',
}

const PARTICLE_COUNT = 6

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Interactive Alma orb with breathing glow, particles, and tap feedback.
 * Supports tap-to-chat navigation and visual particle effects.
 *
 * @param size - Orb size variant (sm/md/lg/xl)
 * @param status - Current status for color
 * @param onClick - Handler for tap interaction
 * @param showParticles - Whether to show orbiting particles
 * @param className - Additional classes
 * @returns Animated interactive orb element
 */
export function AlmaOrb({
  size = 'md',
  status = 'active',
  onClick,
  showParticles = false,
  className,
}: AlmaOrbProps) {
  const [isTapped, setIsTapped] = useState(false)
  const dimension = SIZE_MAP[size]
  const color = STATUS_COLORS[status]
  const isAnimated = status !== 'offline'
  const isInteractive = !!onClick

  const handleTap = useCallback(() => {
    if (!onClick) return
    setIsTapped(true)
    onClick()
    setTimeout(() => setIsTapped(false), 300)
  }, [onClick])

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isInteractive && 'cursor-pointer',
        className
      )}
      style={{ width: dimension, height: dimension }}
      onClick={handleTap}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleTap()
        }
      }}
    >
      {/* Orbiting particles */}
      {showParticles && isAnimated && (
        <div className="absolute inset-0">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                backgroundColor: color,
                opacity: 0.6,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `alma-orbit ${4 + i * 0.5}s linear infinite`,
                animationDelay: `${i * -0.8}s`,
                '--orbit-radius': `${dimension * 0.55}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          animation: isAnimated
            ? isTapped
              ? 'alma-breathe-fast 0.3s ease-out'
              : 'alma-breathe 3s ease-in-out infinite'
            : 'none',
        }}
      />

      {/* Inner orb */}
      <div
        className={cn(
          'relative rounded-full transition-transform',
          isTapped && 'scale-95'
        )}
        style={{
          width: dimension * 0.6,
          height: dimension * 0.6,
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}80)`,
          boxShadow: `0 0 ${dimension * 0.3}px ${color}60`,
          animation: isAnimated
            ? isTapped
              ? 'alma-pulse-fast 0.3s ease-out'
              : 'alma-pulse 3s ease-in-out infinite'
            : 'none',
        }}
      />

      {/* CSS keyframes via style tag */}
      <style jsx>{`
        @keyframes alma-breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes alma-breathe-fast {
          0% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes alma-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes alma-pulse-fast {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes alma-orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  )
}
