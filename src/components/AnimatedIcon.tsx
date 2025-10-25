/**
 * Animated Icon Component
 * Skia-rendered icon with micro-interactions
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Canvas, Circle, Path, useValue, runTiming, Easing} from '@shopify/react-native-skia';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useThemeStore} from '@stores/themeStore';
import {colors, getColor} from '@design/colors';

interface AnimatedIconProps {
  icon: 'heart' | 'star' | 'check' | 'cross';
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  size = 24,
  color,
  onPress,
}) => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const scale = useValue(1);
  const rotation = useValue(0);

  const iconColor = color || getColor(colors.primary, isDarkMode);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      runTiming(scale, 1.2, {duration: 150, easing: Easing.out(Easing.cubic)});
      runTiming(rotation, 15, {duration: 150, easing: Easing.out(Easing.cubic)});
    })
    .onFinalize(() => {
      'worklet';
      runTiming(scale, 1, {duration: 200, easing: Easing.out(Easing.cubic)});
      runTiming(rotation, 0, {duration: 200, easing: Easing.out(Easing.cubic)});
    })
    .onEnd(() => {
      'worklet';
      if (onPress) {
        onPress();
      }
    });

  // Simple icon paths (simplified for demonstration)
  const getIconPath = () => {
    const center = size / 2;
    switch (icon) {
      case 'check':
        return `M ${center * 0.3} ${center} L ${center * 0.6} ${center * 1.3} L ${center * 1.5} ${center * 0.5}`;
      case 'cross':
        return `M ${center * 0.5} ${center * 0.5} L ${center * 1.5} ${center * 1.5} M ${center * 1.5} ${center * 0.5} L ${center * 0.5} ${center * 1.5}`;
      case 'star':
        return `M ${center} ${center * 0.3} L ${center * 1.2} ${center * 1.7} L ${center * 0.2} ${center * 0.8} L ${center * 1.8} ${center * 0.8} L ${center * 0.8} ${center * 1.7} Z`;
      default:
        return `M ${center} ${center} m -${center * 0.8}, 0 a ${center * 0.8},${center * 0.8} 0 1,0 ${center * 1.6},0 a ${center * 0.8},${center * 0.8} 0 1,0 -${center * 1.6},0`;
    }
  };

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={[styles.container, {width: size, height: size}]}>
        <Canvas style={{width: size, height: size}}>
          <Path
            path={getIconPath()}
            color={iconColor}
            style="stroke"
            strokeWidth={2}
            strokeCap="round"
            strokeJoin="round"
          />
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
