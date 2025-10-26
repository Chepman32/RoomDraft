import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

interface BadgeProps {
  count?: number;
  max?: number;
  showZero?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  count = 0,
  max = 99,
  showZero = false,
  variant = 'default',
  size = 'medium',
  dot = false,
  children,
}) => {
  const { theme } = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary[theme];
      case 'success':
        return colors.success[theme];
      case 'error':
        return colors.error[theme];
      case 'warning':
        return colors.warning[theme];
      default:
        return colors.textSecondary[theme];
    }
  };

  const getSizeStyles = () => {
    if (dot) {
      return {
        small: { width: 6, height: 6 },
        medium: { width: 8, height: 8 },
        large: { width: 10, height: 10 },
      }[size];
    }

    return {
      small: { minWidth: 16, height: 16, paddingHorizontal: 4 },
      medium: { minWidth: 20, height: 20, paddingHorizontal: 6 },
      large: { minWidth: 24, height: 24, paddingHorizontal: 8 },
    }[size];
  };

  const getFontSize = () => {
    return {
      small: 10,
      medium: 12,
      large: 14,
    }[size];
  };

  const displayCount = count > max ? `${max}+` : count.toString();
  const shouldShow = count > 0 || showZero;

  if (children) {
    return (
      <View style={styles.wrapper}>
        {children}
        {(shouldShow || dot) && (
          <View
            style={[
              styles.badge,
              getSizeStyles(),
              { backgroundColor: getVariantColor() },
              dot && styles.dot,
              styles.positioned,
            ]}
          >
            {!dot && shouldShow && (
              <Text style={[styles.text, { fontSize: getFontSize() }]}>
                {displayCount}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  if (!shouldShow && !dot) {
    return null;
  }

  return (
    <View
      style={[
        styles.badge,
        getSizeStyles(),
        { backgroundColor: getVariantColor() },
        dot && styles.dot,
      ]}
    >
      {!dot && shouldShow && (
        <Text style={[styles.text, { fontSize: getFontSize() }]}>
          {displayCount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  badge: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    padding: 0,
  },
  positioned: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
