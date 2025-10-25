/**
 * Design System - Color Tokens
 * Accessible palette with light/dark variants
 */

import {ColorToken, ThemeColors} from '@types/index';

// ============================================================================
// Base Color Palette
// ============================================================================

export const palette = {
  // Blues (Primary)
  blue50: '#E3F2FD',
  blue100: '#BBDEFB',
  blue200: '#90CAF9',
  blue300: '#64B5F6',
  blue400: '#42A5F5',
  blue500: '#2196F3',
  blue600: '#1E88E5',
  blue700: '#1976D2',
  blue800: '#1565C0',
  blue900: '#0D47A1',

  // Greens (Success)
  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green500: '#4CAF50',
  green700: '#388E3C',
  green900: '#1B5E20',

  // Reds (Error)
  red50: '#FFEBEE',
  red100: '#FFCDD2',
  red500: '#F44336',
  red700: '#D32F2F',
  red900: '#B71C1C',

  // Oranges (Warning)
  orange50: '#FFF3E0',
  orange100: '#FFE0B2',
  orange500: '#FF9800',
  orange700: '#F57C00',
  orange900: '#E65100',

  // Grays (Neutrals)
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Pure
  white: '#FFFFFF',
  black: '#000000',
};

// ============================================================================
// Semantic Color Tokens
// ============================================================================

export const colors: ThemeColors = {
  // Background
  background: {
    light: palette.white,
    dark: palette.black,
  },
  surface: {
    light: palette.gray50,
    dark: palette.gray900,
  },
  surfaceElevated: {
    light: palette.white,
    dark: palette.gray800,
  },

  // Primary colors
  primary: {
    light: palette.blue600,
    dark: palette.blue400,
  },
  secondary: {
    light: palette.blue200,
    dark: palette.blue700,
  },
  tertiary: {
    light: palette.blue100,
    dark: palette.blue800,
  },

  // Text colors
  textPrimary: {
    light: palette.gray900,
    dark: palette.white,
  },
  textSecondary: {
    light: palette.gray600,
    dark: palette.gray400,
  },
  textTertiary: {
    light: palette.gray500,
    dark: palette.gray500,
  },
  textInverse: {
    light: palette.white,
    dark: palette.black,
  },

  // State colors
  success: {
    light: palette.green700,
    dark: palette.green500,
  },
  warning: {
    light: palette.orange700,
    dark: palette.orange500,
  },
  error: {
    light: palette.red700,
    dark: palette.red500,
  },
  info: {
    light: palette.blue700,
    dark: palette.blue400,
  },

  // Border & divider
  border: {
    light: palette.gray300,
    dark: palette.gray700,
  },
  divider: {
    light: palette.gray200,
    dark: palette.gray800,
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
  scrim: {
    light: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

export const getColor = (token: ColorToken, isDark: boolean): string => {
  return isDark ? token.dark : token.light;
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
