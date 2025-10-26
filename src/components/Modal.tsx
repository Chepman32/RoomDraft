import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { Button } from './Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'scale';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  footer,
  animationType = 'scale',
}) => {
  const { theme } = useTheme();
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      if (animationType === 'scale') {
        modalScale.value = withSpring(1, { stiffness: 240, damping: 18 });
      } else if (animationType === 'slide') {
        modalTranslateY.value = withSpring(0, { stiffness: 240, damping: 18 });
      }
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      if (animationType === 'scale') {
        modalScale.value = withSpring(0.8, { stiffness: 240, damping: 18 });
      } else if (animationType === 'slide') {
        modalTranslateY.value = withSpring(SCREEN_HEIGHT, { stiffness: 240, damping: 18 });
      }
    }
  }, [visible, animationType]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => {
    if (animationType === 'scale') {
      return {
        opacity: backdropOpacity.value,
        transform: [{ scale: modalScale.value }],
      };
    } else if (animationType === 'slide') {
      return {
        transform: [{ translateY: modalTranslateY.value }],
      };
    }
    return {
      opacity: backdropOpacity.value,
    };
  });

  const sizeStyles = {
    small: { maxWidth: 300 },
    medium: { maxWidth: 400 },
    large: { maxWidth: 600 },
    fullscreen: { width: '100%', height: '100%', borderRadius: 0 },
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            { backgroundColor: colors.surface[theme] },
            sizeStyles[size],
            modalAnimatedStyle,
          ]}
        >
          {title && (
            <View style={[styles.header, { borderBottomColor: colors.border[theme] }]}>
              <Text style={[styles.title, { color: colors.text[theme] }]}>
                {title}
              </Text>
              {showCloseButton && (
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <View style={[styles.closeIcon, { backgroundColor: colors.textSecondary[theme] }]} />
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer && (
            <View style={[styles.footer, { borderTopColor: colors.border[theme] }]}>
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.title3,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 20,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    padding: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
});
