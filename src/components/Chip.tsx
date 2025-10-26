import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onDelete,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  icon,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles = {
    small: {
      height: 24,
      paddingHorizontal: spacing.sm,
      fontSize: typography.caption2.fontSize,
    },
    medium: {
      height: 32,
      paddingHorizontal: spacing.md,
      fontSize: typography.body.fontSize,
    },
    large: {
      height: 40,
      paddingHorizontal: spacing.lg,
      fontSize: typography.body.fontSize,
    },
  };

  const getStyles = () => {
    if (variant === 'outlined') {
      return {
        backgroundColor: selected ? colors.primaryContainer[theme] : 'transparent',
        borderColor: selected ? colors.primary[theme] : colors.border[theme],
        borderWidth: 1,
        color: selected ? colors.primary[theme] : colors.text[theme],
      };
    }

    return {
      backgroundColor: selected ? colors.primary[theme] : colors.surfaceVariant[theme],
      borderWidth: 0,
      color: selected ? colors.surface[theme] : colors.text[theme],
    };
  };

  const chipStyles = getStyles();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || !onPress}
        style={[
          styles.chip,
          {
            height: sizeStyles[size].height,
            paddingHorizontal: sizeStyles[size].paddingHorizontal,
            backgroundColor: chipStyles.backgroundColor,
            borderWidth: chipStyles.borderWidth,
            borderColor: chipStyles.borderColor,
          },
          disabled && styles.disabled,
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}

        <Text
          style={[
            styles.label,
            {
              fontSize: sizeStyles[size].fontSize,
              color: chipStyles.color,
            },
          ]}
        >
          {label}
        </Text>

        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.deleteIcon, { backgroundColor: chipStyles.color }]} />
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '500',
  },
  icon: {
    marginRight: spacing.xs,
  },
  deleteButton: {
    marginLeft: spacing.xs,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 12,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  disabled: {
    opacity: 0.5,
  },
});
