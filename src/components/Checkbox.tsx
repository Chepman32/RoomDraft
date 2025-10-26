import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, interpolate } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  indeterminate = false,
}) => {
  const { theme } = useTheme();
  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withSpring(checked || indeterminate ? 1 : 0, {
      stiffness: 320,
      damping: 22,
    });
  }, [checked, indeterminate]);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.9, { stiffness: 320, damping: 22 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { stiffness: 320, damping: 22 });
      onChange(!checked);
    });

  const boxAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      progress.value,
      [0, 1],
      [0, 1]
    );

    return {
      backgroundColor: backgroundColor > 0.5
        ? colors.primary[theme]
        : 'transparent',
      borderColor: backgroundColor > 0.5
        ? colors.primary[theme]
        : colors.border[theme],
      transform: [{ scale: scale.value }],
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  const sizes = {
    small: 18,
    medium: 24,
    large: 28,
  };

  const boxSize = sizes[size];

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, disabled && styles.disabled]}>
        <Animated.View
          style={[
            styles.box,
            { width: boxSize, height: boxSize, borderRadius: boxSize * 0.2 },
            boxAnimatedStyle,
          ]}
        >
          <Animated.View style={checkmarkAnimatedStyle}>
            {indeterminate ? (
              <View style={[styles.indeterminate, { backgroundColor: colors.surface[theme] }]} />
            ) : (
              <View style={styles.checkmark}>
                <View style={[styles.checkmarkLine, { backgroundColor: colors.surface[theme] }]} />
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {label && (
          <Text style={[styles.label, { color: colors.text[theme] }]}>
            {label}
          </Text>
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  box: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkLine: {
    width: '100%',
    height: 2,
    transform: [{ rotate: '45deg' }],
  },
  indeterminate: {
    width: '60%',
    height: 2,
  },
  label: {
    ...typography.body,
    marginLeft: spacing.sm,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
