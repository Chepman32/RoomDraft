import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <ToastItem key={toast.id} toast={toast} index={index} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; index: number }> = ({ toast, index }) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(0, { stiffness: 240, damping: 18 });
    opacity.value = withSequence(
      withSpring(1, { stiffness: 240, damping: 18 }),
      withDelay(
        toast.duration || 3000,
        withSpring(0, { stiffness: 240, damping: 18 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getToastColors = () => {
    switch (toast.type) {
      case 'success':
        return { bg: colors.success[theme], text: colors.surface[theme] };
      case 'error':
        return { bg: colors.error[theme], text: colors.surface[theme] };
      case 'warning':
        return { bg: colors.warning[theme], text: colors.text[theme] };
      case 'info':
      default:
        return { bg: colors.primary[theme], text: colors.surface[theme] };
    }
  };

  const toastColors = getToastColors();

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: toastColors.bg, top: spacing.md + index * 60 },
        animatedStyle,
      ]}
    >
      <Text style={[styles.message, { color: toastColors.text }]}>
        {toast.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    position: 'absolute',
    minWidth: SCREEN_WIDTH * 0.8,
    maxWidth: SCREEN_WIDTH * 0.9,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
  },
});
