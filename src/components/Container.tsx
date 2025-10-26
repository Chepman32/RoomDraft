import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

interface ContainerProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: number | 'small' | 'medium' | 'large' | 'full';
  centered?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'medium',
  maxWidth = 'full',
  centered = false,
  backgroundColor,
  style,
}) => {
  const { theme } = useTheme();

  const paddingValues = {
    none: 0,
    small: spacing.sm,
    medium: spacing.md,
    large: spacing.lg,
  };

  const maxWidthValues = {
    small: 480,
    medium: 768,
    large: 1024,
    full: '100%' as const,
  };

  const containerStyle: ViewStyle = {
    padding: paddingValues[padding],
    maxWidth: typeof maxWidth === 'number' ? maxWidth : maxWidthValues[maxWidth],
    backgroundColor: backgroundColor || colors.background[theme],
    alignSelf: centered ? 'center' : 'auto',
    width: '100%',
  };

  return <View style={[containerStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({});
