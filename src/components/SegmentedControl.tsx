import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onChange,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [segmentWidth, setSegmentWidth] = React.useState(0);
  const animatedIndex = useSharedValue(selectedIndex);

  React.useEffect(() => {
    animatedIndex.value = withSpring(selectedIndex, {
      stiffness: 240,
      damping: 18,
    });
  }, [selectedIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = animatedIndex.value * segmentWidth;

    return {
      transform: [{ translateX }],
      width: segmentWidth,
    };
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant[theme] },
        disabled && styles.disabled,
      ]}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        setSegmentWidth(width / segments.length);
      }}
    >
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.surface[theme] },
          indicatorStyle,
        ]}
      />

      {segments.map((segment, index) => (
        <Pressable
          key={index}
          onPress={() => !disabled && onChange(index)}
          style={styles.segment}
          disabled={disabled}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color:
                  index === selectedIndex
                    ? colors.primary[theme]
                    : colors.textSecondary[theme],
              },
            ]}
          >
            {segment}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: spacing.sm,
    padding: 2,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    left: 2,
    top: 2,
    bottom: 2,
    borderRadius: spacing.sm - 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentText: {
    ...typography.body,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
