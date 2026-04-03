// ============================================================
// ALMA · APP · login/page.tsx
// ============================================================
// What this file does: Login page with email/password and Google OAuth
// Module: auth — see modules/auth/README.md
// Depends on: hooks/useAuth.ts
// Used by: Unauthenticated users
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: useAuth for login actions, useState for form, Link for navigation.

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Client component required for form state and auth hook.

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithGoogle, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
    // Redirect handled by auth state change + middleware
    router.push('/app')
  }

  return (
    <div
      className="w-full max-w-sm p-8 rounded-lg"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Logo */}
      <h1
        className="text-3xl font-bold text-center mb-8"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--accent)',
        }}
      >
        ALMA
      </h1>

      {/* Error display */}
      {error && (
        <div
          className="mb-4 p-3 rounded text-sm"
          style={{
            backgroundColor: 'var(--bg-dim)',
            color: 'var(--error)',
            border: '1px solid var(--error)',
          }}
        >
          {error.message}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: 'var(--bg-dim)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: 'var(--bg-dim)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 rounded font-medium text-sm transition-opacity"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-base)',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        <span
          className="px-3 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          or
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={loginWithGoogle}
        disabled={isLoading}
        className="w-full py-2 rounded font-medium text-sm transition-opacity flex items-center justify-center gap-2"
        style={{
          backgroundColor: 'var(--bg-dim)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Signup link */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="underline"
          style={{ color: 'var(--accent)' }}
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

// ─── HELPERS ──────────────────────────────────────────────
// Why: Inline SVG for Google icon to avoid external dependencies.

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
