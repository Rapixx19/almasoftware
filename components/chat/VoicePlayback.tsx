// ============================================================
// ALMA · COMPONENTS · VoicePlayback.tsx
// ============================================================
// What this file does: Text-to-speech playback button for Alma's messages
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts, lucide-react
// Used by: components/chat/MessageBubble.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly sizing, icons for playback states.

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMode } from '@/hooks/useMode'
import { Volume2, VolumeX, Pause } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface VoicePlaybackProps {
  /** The text content to speak */
  text: string
  /** Optional callback when playback starts */
  onStart?: () => void
  /** Optional callback when playback ends */
  onEnd?: () => void
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

type PlaybackState = 'idle' | 'playing' | 'paused'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Text-to-speech playback button for Alma's messages.
 * Uses Web Speech API for voice synthesis.
 * Shows animated orb while speaking.
 *
 * @param text - The text content to speak
 * @param onStart - Called when playback starts
 * @param onEnd - Called when playback ends
 * @param size - Button size variant
 * @returns Playback button with orb animation
 */
export default function VoicePlayback({
  text,
  onStart,
  onEnd,
  size = 'sm',
}: VoicePlaybackProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  const [state, setState] = useState<PlaybackState>('idle')
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Size mappings
  const sizeMap = {
    sm: { button: isElderly ? 32 : 28, icon: isElderly ? 14 : 12 },
    md: { button: isElderly ? 40 : 36, icon: isElderly ? 18 : 16 },
    lg: { button: isElderly ? 48 : 44, icon: isElderly ? 22 : 20 },
  }
  const { button: buttonSize, icon: iconSize } = sizeMap[size]

  // Check for speech synthesis support
  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current && state === 'playing') {
        window.speechSynthesis.cancel()
      }
    }
  }, [state])

  // Handle play/pause toggle
  const handleToggle = useCallback(() => {
    if (!isSupported) return

    if (state === 'idle') {
      // Start playback
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = isElderly ? 0.85 : 0.95 // Slightly slower for elderly
      utterance.pitch = 1.0

      // Find a suitable voice (prefer female voice for Alma)
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (v) => v.name.includes('Samantha') || // macOS
               v.name.includes('Google UK English Female') ||
               v.name.includes('Microsoft Zira')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onstart = () => {
        setState('playing')
        onStart?.()
      }

      utterance.onend = () => {
        setState('idle')
        onEnd?.()
      }

      utterance.onerror = () => {
        setState('idle')
        onEnd?.()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } else if (state === 'playing') {
      // Pause playback
      window.speechSynthesis.pause()
      setState('paused')
    } else if (state === 'paused') {
      // Resume playback
      window.speechSynthesis.resume()
      setState('playing')
    }
  }, [state, text, isElderly, isSupported, onStart, onEnd])

  // Stop playback
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel()
    setState('idle')
    onEnd?.()
  }, [onEnd])

  // Don't render if not supported
  if (!isSupported) {
    return null
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleToggle}
        onDoubleClick={handleStop}
        className="flex items-center justify-center rounded-full transition-transform"
        style={{
          width: buttonSize,
          height: buttonSize,
          backgroundColor: state === 'idle' ? 'var(--bg-dim)' : 'var(--accent)',
          transform: state === 'playing' ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform var(--duration-fast) var(--ease-move)',
        }}
        aria-label={
          state === 'idle'
            ? 'Play message'
            : state === 'playing'
              ? 'Pause playback'
              : 'Resume playback'
        }
        title={state === 'idle' ? 'Read aloud' : 'Double-click to stop'}
      >
        {state === 'idle' && (
          <Volume2 size={iconSize} style={{ color: 'var(--text-secondary)' }} />
        )}
        {state === 'playing' && (
          <Pause size={iconSize} style={{ color: 'var(--text-on-accent)' }} />
        )}
        {state === 'paused' && (
          <Volume2 size={iconSize} style={{ color: 'var(--text-on-accent)' }} />
        )}
      </button>

      {/* Animated orb glow while speaking */}
      {state === 'playing' && (
        <>
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
              animation: 'speakingPulse 0.8s ease-in-out infinite',
            }}
          />
          {/* Sound wave indicators */}
          <div className="absolute -right-1 flex flex-col gap-[2px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: '4px',
                  backgroundColor: 'var(--accent)',
                  animation: `soundWave 0.6s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes speakingPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }
        @keyframes soundWave {
          0%, 100% {
            height: 4px;
            opacity: 0.5;
          }
          50% {
            height: 10px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
