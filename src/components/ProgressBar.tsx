/**
 * Progress Bar Component
 * Animated progress indicator with Skia rendering
 */

import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Canvas, RoundedRect, useValue, runTiming, Easing} from '@shopify/react-native-skia';
import {useThemeStore} from '@stores/themeStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing, layout} from '@design/spacing';

interface ProgressBarProps {
  progress: number; // 0-1
  label?: string;
  height?: number;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  height = 8,
  showPercentage = true,
  color,
}) => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const animatedProgress = useValue(0);

  const progressColor = color || getColor(colors.primary, isDarkMode);
  const backgroundColor = getColor(colors.surface, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);

  useEffect(() => {
    runTiming(animatedProgress, progress, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={[styles.label, {color: textColor}]}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, {color: textColor}]}>{percentage}%</Text>
          )}
        </View>
      )}

      <View style={[styles.barContainer, {height}]}>
        <Canvas style={{width: '100%', height}}>
          {/* Background */}
          <RoundedRect
            x={0}
            y={0}
            width={300}
            height={height}
            r={height / 2}
            color={backgroundColor}
          />

          {/* Progress fill */}
          <RoundedRect
            x={0}
            y={0}
            width={animatedProgress}
            height={height}
            r={height / 2}
            color={progressColor}
          />
        </Canvas>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption1,
  },
  percentage: {
    ...typography.caption1,
  },
  barContainer: {
    overflow: 'hidden',
    borderRadius: layout.radiusFull,
  },
});
