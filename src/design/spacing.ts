/**
 * Design System - Spacing Grid
 * 8pt spacing system
 */

import {Spacing} from '@types/index';

// ============================================================================
// Spacing Scale (8pt grid)
// ============================================================================

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============================================================================
// Layout Constants
// ============================================================================

export const layout = {
  // Screen padding
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.lg,

  // Component spacing
  componentGap: spacing.md,
  sectionGap: spacing.xl,

  // Touch targets
  minTouchTarget: 44,
  iconTouchTarget: 48,

  // Border radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,
  radiusXLarge: 16,
  radiusFull: 9999,

  // Border width
  borderThin: 1,
  borderMedium: 2,
  borderThick: 4,

  // Shadow elevation
  shadowSmall: 2,
  shadowMedium: 4,
  shadowLarge: 8,
  shadowXLarge: 16,
};

// ============================================================================
// Helper Functions
// ============================================================================

export const multiplier = (base: number, factor: number): number => {
  return base * factor;
};
