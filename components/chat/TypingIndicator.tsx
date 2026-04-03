// ============================================================
// ALMA · COMPONENTS · TypingIndicator.tsx
// ============================================================
// What this file does: Shows animated indicator when Alma is responding
// Module: chat — see modules/chat/README.md
// Depends on: nothing — pure presentational
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-03
// ============================================================

'use client'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Animated typing indicator showing Alma is composing a response.
 * Uses a wave animation with pulsing bars for a modern feel.
 *
 * @returns Typing indicator with animated wave bars
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Animated wave bars */}
        <div className="flex items-end gap-[3px] h-5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                backgroundColor: 'var(--accent)',
                animation: `wave 1s ease-in-out ${i * 0.15}s infinite`,
                height: '8px',
              }}
            />
          ))}
        </div>

        {/* Label */}
        <span
          className="text-sm"
          style={{
            color: 'var(--text-secondary)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          Alma is thinking...
        </span>

        {/* CSS animations via style tag */}
        <style jsx>{`
          @keyframes wave {
            0%, 100% {
              height: 8px;
              opacity: 0.5;
            }
            50% {
              height: 18px;
              opacity: 1;
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
