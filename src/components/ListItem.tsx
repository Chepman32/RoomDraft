import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  disabled = false,
  divider = true,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { stiffness: 320, damping: 22 });
    backgroundColor.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
    backgroundColor.value = withSpring(0, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      backgroundColor.value > 0.5
        ? colors.surfaceVariant[theme]
        : colors.surface[theme],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[styles.container, animatedStyle, disabled && styles.disabled]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text[theme] }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: colors.textSecondary[theme] }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}

      {divider && (
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border[theme] },
            leftIcon && { marginLeft: 56 },
          ]}
        />
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    position: 'relative',
  },
  leftIcon: {
    marginRight: spacing.md,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '500',
  },
  subtitle: {
    ...typography.caption1,
    marginTop: spacing.xxs,
  },
  rightIcon: {
    marginLeft: spacing.md,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: 0,
    height: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
