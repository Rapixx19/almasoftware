// ============================================================
// ALMA · APP · signup/page.tsx
// ============================================================
// What this file does: Signup page with invite code validation
// Module: auth — see modules/auth/README.md
// Depends on: hooks/useAuth.ts
// Used by: New users with valid invite codes
// Zone: YELLOW
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────
// Why: useAuth for signup, useState for multi-step form.

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// ─── COMPONENT ────────────────────────────────────────────
// Why: Two-step signup: validate invite code first, then show email/password.

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading, error } = useAuth()

  // Step tracking: 'code' or 'credentials'
  const [step, setStep] = useState<'code' | 'credentials'>('code')
  const [inviteCode, setInviteCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validate invite code before showing signup form
  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setCodeError(null)
    setIsValidating(true)

    try {
      const response = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim().toUpperCase() }),
      })

      if (!response.ok) {
        const data = await response.json()
        setCodeError(data.error || 'Invalid invite code')
        setIsValidating(false)
        return
      }

      // Code is valid — proceed to credentials step
      setStep('credentials')
    } catch {
      setCodeError('Failed to validate code. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  // Handle final signup
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return // Form validation handles this
    }

    await signup(email, password, inviteCode.trim().toUpperCase())
    // If successful, redirect to app (auth state change triggers middleware)
    router.push('/app')
  }

  return (
    <div
      className="w-full max-w-sm p-8 rounded-lg"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Logo */}
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--accent)',
        }}
      >
        ALMA
      </h1>
      <p
        className="text-center mb-8 text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        {step === 'code' ? 'Enter your invite code' : 'Create your account'}
      </p>

      {/* Error display */}
      {(codeError || error) && (
        <div
          className="mb-4 p-3 rounded text-sm"
          style={{
            backgroundColor: 'var(--bg-dim)',
            color: 'var(--error)',
            border: '1px solid var(--error)',
          }}
        >
          {codeError || error?.message}
        </div>
      )}

      {/* Step 1: Invite code */}
      {step === 'code' && (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="inviteCode"
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Invite Code
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              disabled={isValidating}
              className="w-full px-3 py-2 rounded text-sm text-center tracking-widest"
              style={{
                backgroundColor: 'var(--bg-dim)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
              }}
              placeholder="XXXX-XXXX"
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={isValidating || !inviteCode.trim()}
            className="w-full py-2 rounded font-medium text-sm transition-opacity"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-base)',
              opacity: isValidating || !inviteCode.trim() ? 0.7 : 1,
            }}
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 2: Credentials */}
      {step === 'credentials' && (
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Show validated code */}
          <div
            className="p-2 rounded text-center text-sm"
            style={{
              backgroundColor: 'var(--bg-dim)',
              color: 'var(--success)',
              border: '1px solid var(--success)',
            }}
          >
            Code verified: {inviteCode}
          </div>

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
              minLength={8}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: 'var(--bg-dim)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: 'var(--bg-dim)',
                color: 'var(--text-primary)',
                border: password && confirmPassword && password !== confirmPassword
                  ? '1px solid var(--error)'
                  : '1px solid var(--border)',
              }}
              placeholder="Confirm your password"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs" style={{ color: 'var(--error)' }}>
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full py-2 rounded font-medium text-sm transition-opacity"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-base)',
              opacity: isLoading || password !== confirmPassword ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => setStep('code')}
            disabled={isLoading}
            className="w-full py-2 rounded font-medium text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Back
          </button>
        </form>
      )}

      {/* Login link */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="underline"
          style={{ color: 'var(--accent)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
