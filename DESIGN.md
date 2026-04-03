# Design System — Alma

## Product Context
- **What this is:** Household AI assistant with proactive care features and dedicated elderly mode
- **Who it's for:** Busy households (professionals, families) AND elderly users requiring care support (equal priority)
- **Space/industry:** Consumer AI assistants, home automation, elder care technology
- **Project type:** Mobile-first PWA with Hub hardware integration
- **Reference products:** ElliQ (elderly AI companion), Google Home, Alexa+

## Aesthetic Direction
- **Direction:** Retro-Futuristic meets Ambient Computing
- **Decoration level:** Intentional — motion and light do the heavy lifting (orb breathing, status glows), not decorative elements
- **Mood:** Warm tech, not cold AI. The breathing orb (AlmaOrb) is the emotional anchor, mirroring ElliQ's Pixar lamp success. Calm, trustworthy, present without being intrusive.
- **Reference sites:** https://elliq.com/, https://fuseproject.com/case-studies/elliq/

## Typography

### Font Stack
- **Display/Logo:** Orbitron — futuristic, distinctive. Used ONLY for "ALMA" branding, never body text.
- **Body:** Sora — excellent readability, friendly geometry, works well at all sizes.
- **Data/Labels:** Space Mono — monospace for times, stats, technical labels. Supports tabular-nums.
- **Code:** Space Mono (same as data)

### Type Scale (Standard Mode)
| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Display (logo) | Orbitron | 24px | 700 | 1.2 |
| H1 | Sora | 28px | 700 | 1.3 |
| H2 | Sora | 22px | 600 | 1.35 |
| H3 | Sora | 18px | 600 | 1.4 |
| Body | Sora | 16px | 400 | 1.5 |
| Body Small | Sora | 14px | 400 | 1.5 |
| Label | Space Mono | 12px | 400 | 1.4 |
| Caption | Space Mono | 10px | 400 | 1.4 |
| Data | Space Mono | 16px | 400 | 1.3 |

### Type Scale (Elderly Mode)
| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| H1 | Sora | 32px | 700 | 1.3 |
| H2 | Sora | 26px | 600 | 1.35 |
| Body | Sora | 20px | 400 | 1.5 |
| Button | Sora | 20px | 600 | 1.2 |
| Time Display | Space Mono | 48px | 400 | 1.1 |

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Sora:wght@400;600;700&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
```

## Color

### Approach
Restrained with semantic accents — color is rare and meaningful. Dark base reduces eye strain and creates ambient feel.

### Core Palette
```css
:root {
  /* Backgrounds — dark base, elevated surfaces */
  --bg-base:     #07090F;  /* deepest background */
  --bg-surface:  #0F1117;  /* card backgrounds */
  --bg-elevated: #161A24;  /* modals, sheets */
  --bg-dim:      #1E2433;  /* muted areas */

  /* Brand colours */
  --accent:      #00C8F0;  /* Alma cyan — primary action, active states */
  --success:     #00E5A0;  /* confirmations, done states */
  --warm:        #FF6B35;  /* alerts, attention, urgent */
  --purple:      #8B5CF6;  /* brainstorm mode, thinking state */
  --gold:        #EF9F27;  /* elderly mode accent, care */

  /* Text */
  --text-primary:   #F0F2F8;  /* primary text — contrast 15.4:1 on bg-base */
  --text-secondary: #8892A4;  /* secondary text — contrast 5.8:1 on bg-base */
  --text-muted:     #4A5568;  /* disabled, placeholder — contrast 3.2:1 */

  /* Borders */
  --border:       rgba(255,255,255,0.08);
  --border-light: rgba(255,255,255,0.04);

  /* Semantic */
  --error:   #EF4444;  /* errors, destructive actions */
  --warning: #F59E0B;  /* warnings, caution */
  --info:    #3B82F6;  /* informational */
}
```

### Contrast Ratios (WCAG 2.1 AA Compliance)
| Combination | Ratio | Pass |
|-------------|-------|------|
| --text-primary on --bg-base | 15.4:1 | ✅ AAA |
| --text-secondary on --bg-base | 5.8:1 | ✅ AA |
| --accent on --bg-base | 8.2:1 | ✅ AAA |
| --gold on --bg-base | 6.1:1 | ✅ AA |
| --warm on --bg-base | 5.5:1 | ✅ AA |

### Dark Mode (Default)
This is the only mode. The dark theme is the brand identity. No light mode variant.

## Spacing

### Base Unit
4px — all spacing values are multiples of 4.

### Scale
```css
:root {
  --space-2xs: 2px;   /* 0.5 units */
  --space-xs:  4px;   /* 1 unit */
  --space-sm:  8px;   /* 2 units */
  --space-md:  16px;  /* 4 units */
  --space-lg:  24px;  /* 6 units */
  --space-xl:  32px;  /* 8 units */
  --space-2xl: 48px;  /* 12 units */
  --space-3xl: 64px;  /* 16 units */
}
```

### Density by Mode
- **Standard Mode:** Comfortable — 16px default padding, 12px between list items
- **Elderly Mode:** Spacious — 24px default padding, 20px between list items

## Layout

### Approach
Hybrid — grid-disciplined for standard mode (data-dense tasks, calendar), simplified/large for elderly mode.

### Grid
- **Mobile (375-767px):** Single column, 16px gutters, 16px margins
- **Tablet (768-1023px):** 2 columns where appropriate, 24px gutters
- **Desktop (1024px+):** Max-width 1200px centered, 3 columns, 32px gutters

### Max Content Width
- Standard screens: 428px (mobile), 768px (tablet), 1200px (desktop)
- Elderly mode: 428px max (always mobile-optimized, even on larger screens)

### Border Radius Scale
```css
:root {
  --radius-sm:   4px;   /* subtle rounding, inputs */
  --radius-md:   8px;   /* cards, buttons */
  --radius-lg:   12px;  /* modals, sheets */
  --radius-xl:   16px;  /* large cards */
  --radius-full: 9999px; /* pills, circular elements */
}
```

### Fixed Elements
- **StatusBar:** 54px height (fits mobile safe area)
- **BottomNav:** 88px height (64px visible + 24px safe area)
- **Content Area:** calc(100vh - 54px - 88px)

## Motion

### Approach
Intentional — motion as personality, not decoration. The AlmaOrb breathing animation is the primary motion pattern.

### AlmaOrb Breathing Cycles
| State | Duration | Easing | Color |
|-------|----------|--------|-------|
| Active (calm) | 4s | ease-in-out | --accent (cyan) |
| Thinking | 1.5s | ease-in-out | --purple |
| Alert | 0.8s | ease-in-out | --warm (orange) |
| Offline | none (static) | — | --text-muted |

### Easing Functions
```css
:root {
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);    /* elements appearing */
  --ease-exit:  cubic-bezier(0.4, 0, 1, 1);    /* elements leaving */
  --ease-move:  cubic-bezier(0.4, 0, 0.2, 1);  /* position changes */
}
```

### Duration Scale
```css
:root {
  --duration-micro:  50ms;   /* instant feedback */
  --duration-fast:   150ms;  /* quick transitions */
  --duration-normal: 250ms;  /* standard animations */
  --duration-slow:   400ms;  /* emphasized transitions */
  --duration-slower: 700ms;  /* dramatic reveals */
}
```

### Skeleton Pulse
- Duration: 1.5s
- Easing: ease-in-out
- Opacity: 0.4 to 0.7

## Accessibility

### Touch Targets
- **Standard Mode:** 44px minimum (WCAG 2.1 AA)
- **Elderly Mode:** 80px minimum (exceeds WCAG, research-backed for tremors/arthritis)
- **SOS Button:** 100px minimum

### Keyboard Navigation
- Tab order follows visual hierarchy (top-to-bottom, left-to-right)
- Enter/Space activates focused elements
- Escape closes modals/sheets
- Arrow keys navigate within lists

### ARIA Landmarks
- `<main>` for primary content
- `<nav>` for navigation elements
- `role="alert"` for urgent notifications
- `aria-live="polite"` for status updates

### Screen Reader
- All interactive elements have accessible names
- AlmaOrb status announced on change
- Form inputs have associated labels

## Component Library

### Base Components
| Component | Description | Variants |
|-----------|-------------|----------|
| Card | Container with surface background | default, accent, warm |
| Tag | Small pill label | cyan, green, warm, purple, gold |
| Skeleton | Loading placeholder | line, card, circle |
| AlmaOrb | Animated status orb | sm (40px), md (80px), lg (120px) |

### Interactive Components
| Component | Touch Target | States |
|-----------|--------------|--------|
| Button | 44px+ (80px elderly) | default, hover, active, disabled, loading |
| Checkbox | 44px+ (80px elderly) | unchecked, checked, indeterminate, disabled |
| Slider | 44px track height | default, active, disabled |
| Input | 48px height | default, focus, error, disabled |

### Alert Severity Rendering
| Severity | Position | Behavior |
|----------|----------|----------|
| Low | Inline in feed | Dismisses on tap |
| Medium | Fixed banner above orb | 5s auto-dismiss with countdown |
| Urgent | Full-screen overlay | Must explicitly dismiss |

## Mode-Specific Design

### Standard Mode
- Full navigation (5-tab bottom nav)
- Data-dense layouts (stats, calendar, tasks)
- 16px base font
- 44px touch targets
- All features available

### Elderly Mode
- NO bottom navigation
- 3 large buttons only (Talk, Medications, Call Family)
- SOS button always visible
- 20px base font
- 80px+ touch targets
- 48px time display at top
- Simplified interactions (no swipe gestures)

## Icons
- **Library:** Lucide React
- **Style:** Outline, 1.5px stroke
- **Sizes:** 16px (inline), 20px (buttons), 24px (navigation)

### Quick Actions Icons
| Action | Icon Name |
|--------|-----------|
| New Task | plus-circle |
| Calendar | calendar |
| Brainstorm | lightbulb |
| Settings | settings |
| Display | monitor |

## Greeting Time Boundaries
| Greeting | Time Range |
|----------|------------|
| Good morning | 05:00 - 11:59 |
| Good afternoon | 12:00 - 16:59 |
| Good evening | 17:00 - 21:59 |
| Good night | 22:00 - 04:59 |

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Initial design system created | Formalized existing alma-tokens.css with research-backed additions |
| 2026-04-03 | Dark theme only (no light mode) | Brand identity + ambient AI category standard |
| 2026-04-03 | Dual-mode design (standard + elderly) | Research shows elderly users need different density, not just larger fonts |
| 2026-04-03 | 80px elderly touch targets | Exceeds WCAG 44px based on ElliQ/research for arthritis/tremors |
| 2026-04-03 | AlmaOrb as emotional anchor | Mirrors ElliQ's Pixar lamp success — personality through motion |
| 2026-04-03 | 4s breathing cycle for calm state | Longer cycle = calmer feel; matches ambient computing aesthetic |
