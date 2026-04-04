// ============================================================
// ALMA · COMPONENTS · TypingIndicator.tsx
// ============================================================
// What this file does: Shows orb-style animated indicator when Alma is responding
// Module: chat — see modules/chat/README.md
// Depends on: nothing — pure presentational
// Used by: components/chat/ChatView.tsx
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-07
// ============================================================

'use client'

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Orb-style animated typing indicator showing Alma is composing a response.
 * Features a pulsing orb with glow effect matching the Alma brand.
 * More visually engaging than simple dots, ties into AlmaOrb identity.
 *
 * @returns Typing indicator with orb-style animation
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Orb-style indicator */}
        <div className="relative flex items-center justify-center w-8 h-8">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
              opacity: 0.3,
              animation: 'orbGlow 1.5s ease-in-out infinite',
            }}
          />

          {/* Inner orb */}
          <div
            className="relative w-5 h-5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              boxShadow: '0 0 12px var(--accent)',
              animation: 'orbPulse 1.5s ease-in-out infinite',
            }}
          />

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent)',
                animation: `orbParticle 2s linear ${i * 0.66}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Label */}
        <span
          className="text-sm"
          style={{
            color: 'var(--text-secondary)',
            animation: 'textFade 2s ease-in-out infinite',
          }}
        >
          Alma is thinking...
        </span>

        {/* CSS animations via style tag */}
        <style jsx>{`
          @keyframes orbPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 12px var(--accent);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 0 20px var(--accent), 0 0 30px var(--purple);
            }
          }

          @keyframes orbGlow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
          }

          @keyframes orbParticle {
            0% {
              transform: rotate(0deg) translateX(12px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: rotate(360deg) translateX(12px) rotate(-360deg);
              opacity: 0;
            }
          }

          @keyframes textFade {
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
