import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  formatValue = (v) => v.toString(),
}) => {
  const { theme } = useTheme();
  const trackWidth = useSharedValue(0);
  const thumbPosition = useSharedValue(0);
  const thumbScale = useSharedValue(1);
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    const range = maximumValue - minimumValue;
    const percentage = (value - minimumValue) / range;
    thumbPosition.value = withSpring(percentage, {
      stiffness: 240,
      damping: 18,
    });
    setDisplayValue(value);
  }, [value, minimumValue, maximumValue]);

  const updateValue = (newValue: number) => {
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      thumbScale.value = withSpring(1.2, { stiffness: 320, damping: 22 });
    })
    .onUpdate((event) => {
      const range = maximumValue - minimumValue;
      const percentage = Math.max(0, Math.min(1, event.x / trackWidth.value));
      const rawValue = minimumValue + percentage * range;
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));

      thumbPosition.value = percentage;
      runOnJS(updateValue)(clampedValue);
    })
    .onFinalize(() => {
      thumbScale.value = withSpring(1, { stiffness: 320, damping: 22 });
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = thumbPosition.value * (trackWidth.value - 28);

    return {
      transform: [
        { translateX },
        { scale: thumbScale.value },
      ],
    };
  });

  const activeTrackAnimatedStyle = useAnimatedStyle(() => ({
    width: `${thumbPosition.value * 100}%`,
  }));

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text[theme] }]}>
            {label}
          </Text>
          {showValue && (
            <Text style={[styles.value, { color: colors.textSecondary[theme] }]}>
              {formatValue(displayValue)}
            </Text>
          )}
        </View>
      )}

      <View
        style={styles.trackContainer}
        onLayout={(event) => {
          trackWidth.value = event.nativeEvent.layout.width;
        }}
      >
        <View style={[styles.track, { backgroundColor: colors.surfaceVariant[theme] }]} />
        <Animated.View
          style={[
            styles.activeTrack,
            { backgroundColor: colors.primary[theme] },
            activeTrackAnimatedStyle,
          ]}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: colors.primary[theme],
                shadowColor: colors.shadow[theme],
              },
              thumbAnimatedStyle,
            ]}
          />
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption1,
    fontWeight: '600',
  },
  value: {
    ...typography.caption1,
  },
  trackContainer: {
    height: 28,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  activeTrack: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
