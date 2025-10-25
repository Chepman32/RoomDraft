/**
 * Motion Specifications & Animation Configs
 */

import {Easing, WithSpringConfig, WithTimingConfig} from 'react-native-reanimated';

// ============================================================================
// Spring Configurations
// ============================================================================

export const springConfigs = {
  // Default spring
  default: {
    stiffness: 240,
    damping: 18,
    mass: 1,
  } as WithSpringConfig,

  // Gentle spring (slower, more bounce)
  gentle: {
    stiffness: 180,
    damping: 14,
    mass: 1,
  } as WithSpringConfig,

  // Snappy spring (faster, less bounce)
  snappy: {
    stiffness: 320,
    damping: 22,
    mass: 1,
  } as WithSpringConfig,

  // Bouncy spring
  bouncy: {
    stiffness: 200,
    damping: 12,
    mass: 1,
  } as WithSpringConfig,

  // Stiff spring (minimal bounce)
  stiff: {
    stiffness: 400,
    damping: 30,
    mass: 1,
  } as WithSpringConfig,
};

// ============================================================================
// Timing Configurations
// ============================================================================

export const timingConfigs = {
  // Quick timing
  quick: {
    duration: 220,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  // Default timing
  default: {
    duration: 260,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  // Slow timing
  slow: {
    duration: 360,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  // Linear timing
  linear: {
    duration: 250,
    easing: Easing.linear,
  } as WithTimingConfig,

  // Ease in-out
  easeInOut: {
    duration: 280,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,
};

// ============================================================================
// Motion Specification 1 - Press & Scale
// ============================================================================

export const pressScaleMotion = {
  trigger: 'userGesture' as const,
  duration: {min: 220, max: 360},
  spring: springConfigs.default,
  timing: timingConfigs.default,
  scaleAmount: 0.06,
  translateY: -8,
  opacityChange: 0.25,
};

// ============================================================================
// Common Animation Values
// ============================================================================

export const animationValues = {
  // Scale
  pressScale: 0.96,
  hoverScale: 1.02,
  activeScale: 0.98,

  // Opacity
  disabledOpacity: 0.5,
  hoverOpacity: 0.8,
  activeOpacity: 0.6,

  // Translation
  slideDistance: 20,
  swipeThreshold: 50,

  // Rotation
  tiltAngle: 5,
  spinAngle: 360,

  // Blur
  blurRadius: 10,

  // Shadow
  shadowElevation: {
    low: 2,
    medium: 4,
    high: 8,
    veryHigh: 16,
  },
};

// ============================================================================
// Gesture Thresholds
// ============================================================================

export const gestureThresholds = {
  tap: {
    maxDuration: 200,
    maxDistance: 10,
  },
  longPress: {
    minDuration: 500,
    maxDistance: 10,
  },
  swipe: {
    minVelocity: 500,
    minDistance: 50,
  },
  pinch: {
    minScale: 0.5,
    maxScale: 3.0,
  },
  pan: {
    activateAfter: 0,
    minPointers: 1,
  },
};
