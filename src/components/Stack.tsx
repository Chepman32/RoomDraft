import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/design/spacing';

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: keyof typeof spacing;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  style?: ViewStyle;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing: spacingProp = 'md',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = false,
  style,
}) => {
  const gap = spacing[spacingProp];

  const stackStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap,
  };

  return <View style={[stackStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({});
