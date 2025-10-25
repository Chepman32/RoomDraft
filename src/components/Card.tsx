/**
 * Card Component
 * Animated card with swipe gestures and Skia shadow rendering
 */

import React, {ReactNode} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useThemeStore} from '@stores/themeStore';
import {colors, getColor} from '@design/colors';
import {spacing, layout} from '@design/spacing';
import {springConfigs, timingConfigs} from '@animations/motionConfig';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  elevation?: 'low' | 'medium' | 'high';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  onSwipeLeft,
  onSwipeRight,
  elevation = 'medium',
  padding = spacing.md,
}) => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.98, springConfigs.snappy);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, springConfigs.default);
    })
    .onEnd(() => {
      'worklet';
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(!!onSwipeLeft || !!onSwipeRight)
    .onUpdate(event => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.2; // Slight vertical movement
    })
    .onEnd(event => {
      'worklet';
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe detected
        if (event.translationX > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)();
        } else if (event.translationX < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)();
        }
      }

      // Reset position
      translateX.value = withSpring(0, springConfigs.default);
      translateY.value = withSpring(0, springConfigs.default);
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  const getShadowElevation = () => {
    switch (elevation) {
      case 'low':
        return 2;
      case 'high':
        return 8;
      default:
        return 4;
    }
  };

  const backgroundColor = getColor(colors.surfaceElevated, isDarkMode);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            padding,
            elevation: getShadowElevation(),
            shadowOffset: {width: 0, height: getShadowElevation() / 2},
          },
          animatedStyle,
        ]}
        accessible={true}
        accessibilityRole="button">
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radiusLarge,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
