import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, interpolate, interpolateColor } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  size = 'medium',
}) => {
  const { theme } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      stiffness: 240,
      damping: 18,
    });
  }, [value]);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.95, { stiffness: 320, damping: 22 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { stiffness: 320, damping: 22 });
      onValueChange(!value);
    });

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.surfaceVariant[theme], colors.primary[theme]]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const sizes = {
      small: { track: 40, thumb: 16 },
      medium: { track: 51, thumb: 20 },
      large: { track: 62, thumb: 24 },
    };

    const { track, thumb } = sizes[size];
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [2, track - thumb - 2]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const sizes = {
    small: { width: 40, height: 20, thumb: 16 },
    medium: { width: 51, height: 31, thumb: 27 },
    large: { width: 62, height: 38, thumb: 34 },
  };

  const { width, height, thumb } = sizes[size];

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, disabled && styles.disabled]}>
        <Animated.View
          style={[
            styles.track,
            { width, height, borderRadius: height / 2 },
            trackAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumb,
                height: thumb,
                borderRadius: thumb / 2,
                backgroundColor: colors.surface[theme],
              },
              thumbAnimatedStyle,
            ]}
          />
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
  track: {
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    ...typography.body,
    marginLeft: spacing.md,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
