import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'solid' | 'dashed';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  spacing: spacingProp = 'none',
  variant = 'solid',
}) => {
  const { theme } = useTheme();

  const spacingValues = {
    none: 0,
    small: spacing.xs,
    medium: spacing.sm,
    large: spacing.md,
  };

  const marginValue = spacingValues[spacingProp];

  const isDashed = variant === 'dashed';

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: thickness,
            backgroundColor: isDashed ? 'transparent' : colors.border[theme],
            borderLeftWidth: isDashed ? thickness : 0,
            borderLeftColor: colors.border[theme],
            borderStyle: isDashed ? 'dashed' : 'solid',
            marginHorizontal: marginValue,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        {
          height: thickness,
          backgroundColor: isDashed ? 'transparent' : colors.border[theme],
          borderTopWidth: isDashed ? thickness : 0,
          borderTopColor: colors.border[theme],
          borderStyle: isDashed ? 'dashed' : 'solid',
          marginVertical: marginValue,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});
