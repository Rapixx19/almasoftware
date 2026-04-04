// ============================================================
// ALMA · APP · settings/page.tsx
// ============================================================
// What this file does: Full settings page with autonomy, integrations, and profile
// Module: shell — see modules/shell/README.md
// Depends on: hooks/useSettings, components/screens/*
// Used by: BottomNav navigation
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-08
// ============================================================

'use client'

// ─── IMPORTS ──────────────────────────────────────────────

import { Send, Zap, Home, Brain, Trash2, Cpu, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { LogoutButton } from '../LogoutButton'
import { useSettings } from '@/hooks/useSettings'
import {
  SettingsProfileCard,
  AutonomySlider,
  IntegrationItem,
} from '@/components/screens'
import type { AutonomyKey } from '@/types/alma'

// ─── TYPES ────────────────────────────────────────────────

interface SectionProps {
  title: string
  children: React.ReactNode
}

// ─── SECTION COMPONENT ───────────────────────────────────

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <h2
        className="text-xs uppercase tracking-wider px-1"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

// ─── MENU LINK COMPONENT ─────────────────────────────────

interface MenuLinkProps {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  danger?: boolean
}

function MenuLink({ icon, label, href, onClick, danger }: MenuLinkProps) {
  const content = (
    <div
      className="flex items-center justify-between p-4 rounded-xl transition-opacity hover:opacity-80 cursor-pointer"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ backgroundColor: 'var(--bg-dim)' }}
        >
          {icon}
        </div>
        <span
          className="text-sm font-medium"
          style={{
            fontFamily: 'var(--font-display)',
            color: danger ? 'var(--danger)' : 'var(--text-primary)',
          }}
        >
          {label}
        </span>
      </div>
      <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

// ─── COMPONENT ────────────────────────────────────────────

/**
 * Full settings page with profile, autonomy sliders, integrations,
 * memory & privacy options, hub settings, and version info.
 */
export default function SettingsPage() {
  const { profile, autonomySettings, isLoading, updateAutonomy } = useSettings()

  // Placeholder state for integrations (will be implemented later)
  const integrations = {
    telegram: false,
    zapier: false,
    homeAssistant: false,
  }

  const handleConnect = (name: string) => {
    console.log(`Connecting to ${name}...`)
    // TODO: Implement integration connection
  }

  const handleDisconnect = (name: string) => {
    console.log(`Disconnecting from ${name}...`)
    // TODO: Implement integration disconnection
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    console.log('Delete account requested')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{
            borderColor: 'var(--bg-dim)',
            borderTopColor: 'var(--accent)',
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page Title */}
      <h1
        className="text-2xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
        }}
      >
        Settings
      </h1>

      {/* 1. Profile Card */}
      <SettingsProfileCard
        displayName={profile?.display_name || 'User'}
        role={undefined}
        country={undefined}
      />

      {/* 2. Autonomy Section */}
      <Section title="Autonomy">
        <div
          className="p-4 rounded-xl space-y-6"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <AutonomySlider
            label="Messages"
            value={autonomySettings?.messages ?? 50}
            onChange={(value) => updateAutonomy('messages' as AutonomyKey, value)}
          />
          <AutonomySlider
            label="Calendar"
            value={autonomySettings?.calendar ?? 50}
            onChange={(value) => updateAutonomy('calendar' as AutonomyKey, value)}
          />
          <AutonomySlider
            label="Smart Home"
            value={autonomySettings?.smart_home ?? 50}
            onChange={(value) => updateAutonomy('smart_home' as AutonomyKey, value)}
          />
        </div>
      </Section>

      {/* 3. Integrations Section */}
      <Section title="Integrations">
        <div className="space-y-2">
          <IntegrationItem
            icon={Send}
            name="Telegram"
            description="Message Alma via Telegram"
            isConnected={integrations.telegram}
            onConnect={() => handleConnect('Telegram')}
            onDisconnect={() => handleDisconnect('Telegram')}
          />
          <IntegrationItem
            icon={Zap}
            name="Zapier"
            description="Automate with 5000+ apps"
            isConnected={integrations.zapier}
            onConnect={() => handleConnect('Zapier')}
            onDisconnect={() => handleDisconnect('Zapier')}
          />
          <IntegrationItem
            icon={Home}
            name="Home Assistant"
            description="Control your smart home"
            isConnected={integrations.homeAssistant}
            onConnect={() => handleConnect('Home Assistant')}
            onDisconnect={() => handleDisconnect('Home Assistant')}
          />
        </div>
      </Section>

      {/* 4. Memory & Privacy Section */}
      <Section title="Memory & Privacy">
        <div className="space-y-2">
          <MenuLink
            icon={<Brain size={20} style={{ color: 'var(--text-secondary)' }} />}
            label="Memory Viewer"
            href="/app/memories"
          />
          <MenuLink
            icon={<Trash2 size={20} style={{ color: 'var(--danger)' }} />}
            label="Delete Account"
            onClick={handleDeleteAccount}
            danger
          />
        </div>
      </Section>

      {/* 5. Hub Settings Section */}
      <Section title="Hub Settings">
        <div
          className="p-4 rounded-xl space-y-3"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: 'var(--bg-dim)' }}
              >
                <Cpu size={20} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Alma Hub
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Core device for your home
                </span>
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--bg-dim)' }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--success)' }}
              />
              <span
                className="text-xs uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                Online
              </span>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-4 pt-2 border-t"
            style={{ borderColor: 'var(--bg-dim)' }}
          >
            <div>
              <span
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                Device ID
              </span>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                alma-hub-001
              </p>
            </div>
            <div>
              <span
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                Firmware
              </span>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Logout Button */}
      <div className="mt-2">
        <LogoutButton />
      </div>

      {/* 6. Version Tag */}
      <p
        className="text-center text-xs pt-4"
        style={{ color: 'var(--text-muted)' }}
      >
        Alma v1.0.0 · The soul of your household
      </p>
    </div>
  )
}
