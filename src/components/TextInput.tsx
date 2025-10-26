import React, { useState } from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  required = false,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusProgress.value = withSpring(1, { stiffness: 240, damping: 18 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusProgress.value = withSpring(0, { stiffness: 240, damping: 18 });
    onBlur?.(e);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [
        error ? colors.error[theme] : colors.border[theme],
        error ? colors.error[theme] : colors.primary[theme],
      ]
    );

    return {
      borderColor,
      borderWidth: variant === 'outlined' ? (focusProgress.value > 0 ? 2 : 1) : 0,
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const labelColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [
        error ? colors.error[theme] : colors.textSecondary[theme],
        error ? colors.error[theme] : colors.primary[theme],
      ]
    );

    return {
      color: labelColor,
    };
  });

  const sizeStyles = {
    small: {
      height: 36,
      fontSize: typography.caption1.fontSize,
      paddingHorizontal: spacing.sm,
    },
    medium: {
      height: 44,
      fontSize: typography.body.fontSize,
      paddingHorizontal: spacing.md,
    },
    large: {
      height: 52,
      fontSize: typography.title3.fontSize,
      paddingHorizontal: spacing.lg,
    },
  };

  const variantStyles = {
    outlined: {
      borderRadius: spacing.sm,
      backgroundColor: colors.surface[theme],
    },
    filled: {
      borderRadius: spacing.sm,
      backgroundColor: colors.surfaceVariant[theme],
      borderBottomWidth: 2,
    },
    underlined: {
      borderBottomWidth: 1,
      backgroundColor: 'transparent',
    },
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.container,
          variantStyles[variant],
          sizeStyles[size],
          containerAnimatedStyle,
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <RNTextInput
          {...props}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              fontSize: sizeStyles[size].fontSize,
              color: colors.text[theme],
            },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={colors.textTertiary[theme]}
          selectionColor={colors.primary[theme]}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Animated.View>

      {error && <Text style={[styles.helperText, styles.errorText]}>{error}</Text>}
      {!error && hint && <Text style={styles.helperText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption1,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error.light,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...typography.body,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: spacing.xs,
      },
    }),
  },
  inputWithLeftIcon: {
    marginLeft: spacing.xs,
  },
  inputWithRightIcon: {
    marginRight: spacing.xs,
  },
  leftIcon: {
    marginLeft: spacing.sm,
  },
  rightIcon: {
    marginRight: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  helperText: {
    ...typography.caption2,
    color: colors.textSecondary.light,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  errorText: {
    color: colors.error.light,
  },
});
