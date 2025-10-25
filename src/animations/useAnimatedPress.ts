/**
 * Custom Hook - Animated Press
 * Implements motion specification 1-1 through 1-15
 */

import {useSharedValue, useAnimatedStyle, withSpring, withTiming} from 'react-native-reanimated';
import {
  Gesture,
  GestureType,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {pressScaleMotion, springConfigs, timingConfigs} from './motionConfig';

interface UseAnimatedPressOptions {
  scaleAmount?: number;
  translateY?: number;
  opacityChange?: number;
  onPress?: () => void;
}

export const useAnimatedPress = (options: UseAnimatedPressOptions = {}) => {
  const {
    scaleAmount = pressScaleMotion.scaleAmount,
    translateY = pressScaleMotion.translateY,
    opacityChange = pressScaleMotion.opacityChange,
    onPress,
  } = options;

  const progress = useSharedValue(0);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      progress.value = withSpring(1, springConfigs.default);
    })
    .onFinalize(() => {
      'worklet';
      progress.value = withTiming(0, timingConfigs.default);
    })
    .onEnd(() => {
      'worklet';
      if (onPress) {
        onPress();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: 1 + scaleAmount * progress.value},
        {translateY: translateY * progress.value},
      ],
      opacity: 0.75 + opacityChange * progress.value,
    };
  });

  return {gesture, animatedStyle};
};
