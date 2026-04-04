// ============================================================
// ALMA · COMPONENTS · VoiceInput.tsx
// ============================================================
// What this file does: Voice recording UI with waveform visualization
// Module: chat — see modules/chat/README.md
// Depends on: hooks/useMode.ts, lucide-react
// Used by: components/chat/ChatInput.tsx or ChatView.tsx
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Mode hook for elderly sizing, icons for UI, effects for audio handling.

import { useState, useRef, useEffect, useCallback } from 'react'
import { useMode } from '@/hooks/useMode'
import { Mic, MicOff, Send, X } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────

interface VoiceInputProps {
  /** Called when recording is complete with transcribed text */
  onTranscript: (text: string) => void
  /** Called when recording is complete with audio blob (for sending raw audio) */
  onAudioBlob?: (blob: Blob) => void
  /** Whether the voice input is disabled */
  isDisabled?: boolean
  /** Callback when recording starts */
  onRecordingStart?: () => void
  /** Callback when recording ends */
  onRecordingEnd?: () => void
}

type RecordingState = 'idle' | 'recording' | 'processing'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Voice input component with recording animation and waveform visualization.
 * Uses Web Speech API for transcription when available.
 * Falls back to sending audio blob if no transcription available.
 *
 * @param onTranscript - Called with transcribed text
 * @param onAudioBlob - Called with recorded audio blob
 * @param isDisabled - Whether recording is disabled
 * @returns Voice input button with recording UI
 */
export default function VoiceInput({
  onTranscript,
  onAudioBlob,
  isDisabled = false,
  onRecordingStart,
  onRecordingEnd,
}: VoiceInputProps) {
  const { mode } = useMode()
  const isElderly = mode === 'elderly'

  const [state, setState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0])
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const transcriptRef = useRef<string>('')

  // Sizes based on mode
  const buttonSize = isElderly ? 56 : 48
  const iconSize = isElderly ? 24 : 20

  // Check for Web Speech API support
  const hasSpeechRecognition = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // Analyze audio levels for waveform
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Sample 5 frequency bands for waveform
    const bands = 5
    const bandSize = Math.floor(dataArray.length / bands)
    const levels: number[] = []

    for (let i = 0; i < bands; i++) {
      let sum = 0
      for (let j = 0; j < bandSize; j++) {
        sum += dataArray[i * bandSize + j] ?? 0
      }
      // Normalize to 0-1 range
      levels.push((sum / bandSize / 255) * 1.2) // Slight boost for visibility
    }

    setAudioLevels(levels)

    if (state === 'recording') {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    }
  }, [state])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      chunksRef.current = []
      transcriptRef.current = ''

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analysis
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      // Set up speech recognition if available
      if (hasSpeechRecognition) {
        const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognitionCtor) {
          recognitionRef.current = new SpeechRecognitionCtor()
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = 'en-US'

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            let transcript = ''
            for (let i = 0; i < event.results.length; i++) {
              const result = event.results[i]
              if (result && result[0]) {
                transcript += result[0].transcript
              }
            }
            transcriptRef.current = transcript
          }

          recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error)
          }

          recognitionRef.current.start()
        }
      }

      // Start recording
      mediaRecorderRef.current.start()
      setState('recording')
      onRecordingStart?.()

      // Start duration timer
      setDuration(0)
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)

      // Start audio visualization
      analyzeAudio()
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Unable to access microphone')
      setState('idle')
    }
  }, [hasSpeechRecognition, analyzeAudio, onRecordingStart])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (mediaRecorderRef.current && state === 'recording') {
      setState('processing')

      mediaRecorderRef.current.onstop = () => {
        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop())

        // Create audio blob
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })

        // If we have a transcript, use it
        if (transcriptRef.current.trim()) {
          onTranscript(transcriptRef.current.trim())
        } else if (onAudioBlob) {
          // Otherwise, send the audio blob
          onAudioBlob(blob)
        }

        onRecordingEnd?.()
        setState('idle')
        setAudioLevels([0, 0, 0, 0, 0])
      }

      mediaRecorderRef.current.stop()
    }
  }, [state, onTranscript, onAudioBlob, onRecordingEnd])

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }

    onRecordingEnd?.()
    setState('idle')
    setDuration(0)
    setAudioLevels([0, 0, 0, 0, 0])
  }, [onRecordingEnd])

  // Format duration as mm:ss
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Toggle recording
  const handleToggle = () => {
    if (isDisabled) return

    if (state === 'idle') {
      startRecording()
    } else if (state === 'recording') {
      stopRecording()
    }
  }

  // Render idle state (mic button)
  if (state === 'idle') {
    return (
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className="flex items-center justify-center rounded-full transition-opacity"
        style={{
          width: buttonSize,
          height: buttonSize,
          backgroundColor: isDisabled ? 'var(--bg-dim)' : 'var(--bg-surface)',
          opacity: isDisabled ? 0.5 : 1,
          border: '1px solid var(--border)',
        }}
        aria-label="Start voice recording"
      >
        <Mic size={iconSize} style={{ color: 'var(--accent)' }} />
      </button>
    )
  }

  // Render recording state
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--accent)',
        animation: 'fadeIn var(--duration-fast) var(--ease-enter)',
      }}
    >
      {/* Recording indicator with orb animation */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: buttonSize, height: buttonSize }}
      >
        {/* Pulsing glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: 'var(--warm)',
            opacity: 0.2,
            animation: 'recordPulse 1s ease-in-out infinite',
          }}
        />
        {/* Inner circle */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: buttonSize * 0.7,
            height: buttonSize * 0.7,
            backgroundColor: 'var(--warm)',
          }}
        >
          {state === 'processing' ? (
            <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
          ) : (
            <MicOff size={iconSize * 0.7} style={{ color: 'white' }} />
          )}
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="flex items-center gap-1 h-8">
        {audioLevels.map((level, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all"
            style={{
              height: `${Math.max(8, level * 32)}px`,
              backgroundColor: 'var(--accent)',
              transition: 'height 50ms ease-out',
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span
        className="text-sm font-mono min-w-[40px]"
        style={{ color: 'var(--text-secondary)' }}
      >
        {formatDuration(duration)}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Cancel button */}
        <button
          onClick={cancelRecording}
          disabled={state === 'processing'}
          className="p-2 rounded-full"
          style={{ backgroundColor: 'var(--bg-dim)' }}
          aria-label="Cancel recording"
        >
          <X size={iconSize} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Send button */}
        <button
          onClick={stopRecording}
          disabled={state === 'processing'}
          className="p-2 rounded-full"
          style={{ backgroundColor: 'var(--accent)' }}
          aria-label="Send recording"
        >
          <Send size={iconSize} style={{ color: 'var(--text-on-accent)' }} />
        </button>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes recordPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// ─── TYPE DECLARATIONS ────────────────────────────────────
// Why: Web Speech API types not always available in TypeScript

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}
