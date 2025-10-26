import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

export interface ToolbarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}

interface ToolbarProps {
  items: ToolbarItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'primary' | 'secondary';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  items,
  orientation = 'horizontal',
  variant = 'primary',
}) => {
  const { theme } = useTheme();

  const Container = orientation === 'horizontal' ? ScrollView : View;

  return (
    <Container
      horizontal={orientation === 'horizontal'}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[
        styles.container,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          backgroundColor:
            variant === 'primary'
              ? colors.surface[theme]
              : colors.surfaceVariant[theme],
        },
      ]}
    >
      {items.map((item) => (
        <ToolbarButton key={item.id} item={item} />
      ))}
    </Container>
  );
};

const ToolbarButton: React.FC<{ item: ToolbarItem }> = ({ item }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const bgProgress = useSharedValue(item.active ? 1 : 0);

  React.useEffect(() => {
    bgProgress.value = withSpring(item.active ? 1 : 0, {
      stiffness: 240,
      damping: 18,
    });
  }, [item.active]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      bgProgress.value > 0.5
        ? colors.primaryContainer[theme]
        : 'transparent',
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={item.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={item.disabled}
        style={[
          styles.button,
          item.disabled && styles.disabled,
        ]}
      >
        <View style={styles.iconContainer}>{item.icon}</View>
        <Text
          style={[
            styles.label,
            {
              color: item.active
                ? colors.primary[theme]
                : colors.textSecondary[theme],
            },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 64,
    borderRadius: spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: spacing.xxs,
  },
  label: {
    ...typography.caption2,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
