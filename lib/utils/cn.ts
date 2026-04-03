// ============================================================
// ALMA · LIB · cn.ts
// ============================================================
// What this file does: Merges Tailwind classes with conflict resolution
// Module: foundation — see modules/foundation/README.md
// Depends on: clsx, tailwind-merge
// Used by: all components that need conditional class merging
// Zone: GREEN
// Handoff: NO
// Last checkpoint: PHASE-00
// ============================================================

// ─── IMPORTS ──────────────────────────────────────────────
// Why: clsx handles conditional classes, tailwind-merge resolves conflicts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── HELPERS ──────────────────────────────────────────────

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @param inputs - Class values (strings, objects, arrays, or conditionals)
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-accent', 'px-6')
 * // Returns 'py-2 px-6' (px-4 overwritten by px-6, bg-accent if active)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
