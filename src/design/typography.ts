/**
 * Design System - Typography
 * SF Pro Text/Display with dynamic type scaling
 */

import {Typography, TextStyle} from '@types/index';
import {Platform} from 'react-native';

// ============================================================================
// Font Families
// ============================================================================

const fontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// ============================================================================
// Typography Scale
// ============================================================================

export const typography: Typography = {
  largeTitle: {
    fontFamily: fontFamily.bold || 'System',
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  title1: {
    fontFamily: fontFamily.bold || 'System',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  title2: {
    fontFamily: fontFamily.bold || 'System',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  title3: {
    fontFamily: fontFamily.semibold || 'System',
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: 0.38,
  },
  headline: {
    fontFamily: fontFamily.semibold || 'System',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  body: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  bodyBold: {
    fontFamily: fontFamily.semibold || 'System',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  callout: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: -0.32,
  },
  subheadline: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  footnote: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.08,
  },
  caption1: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption2: {
    fontFamily: fontFamily.regular || 'System',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    letterSpacing: 0.07,
  },
};

// ============================================================================
// Dynamic Type Scaling
// ============================================================================

export const scaleFont = (size: number, scale: number): number => {
  return Math.round(size * scale);
};

export const getScaledTypography = (scale: number = 1): Typography => {
  const scaled: any = {};
  for (const [key, value] of Object.entries(typography)) {
    scaled[key] = {
      ...value,
      fontSize: scaleFont(value.fontSize, scale),
      lineHeight: scaleFont(value.lineHeight, scale),
    };
  }
  return scaled as Typography;
};
