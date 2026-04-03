// ============================================================
// ALMA · APP · layout.tsx
// ============================================================
// What this file does: Root layout with Alma fonts and dark theme
// Module: foundation — see modules/foundation/README.md
// Depends on: styles/alma-tokens.css, next/font/google
// Used by: All pages
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-01
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: Google Fonts for Alma branding, globals.css for tokens.

import type { Metadata, Viewport } from 'next'
import { Orbitron, Sora, Space_Mono } from 'next/font/google'
import './globals.css'

// ─── FONTS ────────────────────────────────────────────────
// Why: Alma design system fonts — Orbitron (display), Sora (body), Space Mono (data).

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

// ─── METADATA ─────────────────────────────────────────────
// Why: SEO and PWA manifest configuration.

export const metadata: Metadata = {
  title: 'Alma',
  description: 'The soul of your household',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Alma',
  },
}

export const viewport: Viewport = {
  themeColor: '#07090F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// ─── COMPONENT ────────────────────────────────────────────
// Why: Root layout applies fonts and dark theme to all pages.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${sora.variable} ${spaceMono.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          backgroundColor: 'var(--bg-base)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
