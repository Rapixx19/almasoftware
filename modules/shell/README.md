# Shell Module

## Purpose
App shell including mode-aware layout, navigation, and status bar components.
Supports two modes: standard (5-tab nav) and elderly (simplified 3-button nav).

## Exports

### Components (`components/shell/`)
- `Shell` — Main app wrapper, renders mode-appropriate layout
- `StatusBar` — Top status bar with time and ALMA branding (standard mode)
- `BottomNav` — 5-tab bottom navigation (standard mode)
- `ElderlyShell` — Simplified shell for elderly mode
- `SOSButton` — Emergency SOS button (elderly mode)

### Hooks (`hooks/`)
- `useMode` — Provides current mode from `users_profile.current_mode`

## Layout Dimensions
```css
--status-bar-height: 54px
--bottom-nav-height: 88px  /* 64px visible + 24px safe area */
--content-height: calc(100vh - 54px - 88px)
```

## Mode Comparison
| Feature | Standard | Elderly |
|---------|----------|---------|
| Navigation | 5-tab BottomNav | 3 large buttons |
| Touch targets | 44px min | 80px+ min |
| Font size | 16px body | 20px body |
| SOS button | No | Yes (100px target) |

## Dependencies
- `modules/auth` — User session
- `modules/foundation` — Types and utilities
- `lucide-react` — Icons

## Used By
- `app/app/layout.tsx` — Wraps all `/app/*` routes
- All authenticated pages

## Zone
GREEN — Cursor edits freely.

## Phase
Implemented in Phase 02.
