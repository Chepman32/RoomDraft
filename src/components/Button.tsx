/**
 * Button Component
 * Reusable button with press animations, gestures, and Skia rendering
 * Implements motion specification patterns with spring animations
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import {useThemeStore} from '@stores/themeStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing, layout} from '@design/spacing';
import {springConfigs, timingConfigs} from '@animations/motionConfig';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.96, springConfigs.snappy);
      translateY.value = withSpring(-2, springConfigs.snappy);
      opacity.value = withTiming(0.8, timingConfigs.quick);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, springConfigs.default);
      translateY.value = withSpring(0, springConfigs.default);
      opacity.value = withTiming(1, timingConfigs.default);
    })
    .onEnd(() => {
      'worklet';
      if (onPress) {
        onPress();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: translateY.value}],
    opacity: opacity.value,
  }));

  // Color based on variant
  const getBackgroundColor = () => {
    if (disabled) {
      return getColor(colors.border, isDarkMode);
    }
    switch (variant) {
      case 'primary':
        return getColor(colors.primary, isDarkMode);
      case 'secondary':
        return getColor(colors.secondary, isDarkMode);
      case 'tertiary':
        return getColor(colors.surfaceElevated, isDarkMode);
      default:
        return getColor(colors.primary, isDarkMode);
    }
  };

  const getTextColor = () => {
    if (variant === 'tertiary') {
      return getColor(colors.textPrimary, isDarkMode);
    }
    return '#FFFFFF';
  };

  // Size-based dimensions
  const getPadding = () => {
    switch (size) {
      case 'small':
        return {horizontal: spacing.sm, vertical: spacing.xs};
      case 'large':
        return {horizontal: spacing.xl, vertical: spacing.md};
      default:
        return {horizontal: spacing.md, vertical: spacing.sm};
    }
  };

  const padding = getPadding();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          {
            paddingHorizontal: padding.horizontal,
            paddingVertical: padding.vertical,
            backgroundColor: getBackgroundColor(),
            opacity: disabled ? 0.5 : 1,
          },
          fullWidth && styles.fullWidth,
          animatedStyle,
        ]}
        accessible={true}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{disabled}}>
        <Animated.Text style={[styles.text, {color: getTextColor()}]}>
          {icon && `${icon} `}
          {title}
        </Animated.Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...typography.headline,
  },
});
