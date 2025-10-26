import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

interface FabProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Fab: React.FC<FabProps> = ({
  icon,
  onPress,
  size = 'medium',
  extended = false,
  label,
  position = 'bottom-right',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const handlePress = () => {
    rotation.value = withSpring(rotation.value + 360, {
      stiffness: 240,
      damping: 18,
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      {
        rotate: `${interpolate(rotation.value, [0, 360], [0, 360])}deg`,
      },
    ],
  }));

  const sizes = {
    small: 40,
    medium: 56,
    large: 64,
  };

  const fabSize = sizes[size];

  const positionStyles = {
    'bottom-right': {
      position: 'absolute' as const,
      bottom: spacing.xl,
      right: spacing.lg,
    },
    'bottom-left': {
      position: 'absolute' as const,
      bottom: spacing.xl,
      left: spacing.lg,
    },
    'bottom-center': {
      position: 'absolute' as const,
      bottom: spacing.xl,
      left: '50%',
      transform: [{ translateX: -(fabSize / 2) }],
    },
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.fab,
        {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: colors.primary[theme],
        },
        positionStyles[position],
        animatedStyle,
        disabled && styles.disabled,
      ]}
    >
      {icon}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
