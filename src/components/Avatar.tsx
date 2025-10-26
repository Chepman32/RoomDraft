import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';

interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circular' | 'rounded' | 'square';
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'medium',
  variant = 'circular',
  backgroundColor,
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: 32,
    medium: 40,
    large: 56,
    xlarge: 72,
  };

  const fontSizes = {
    small: 14,
    medium: 16,
    large: 24,
    xlarge: 32,
  };

  const borderRadius = {
    circular: sizes[size] / 2,
    rounded: sizes[size] / 4,
    square: 0,
  };

  const defaultBg = backgroundColor || colors.primary[theme];

  return (
    <View
      style={[
        styles.container,
        {
          width: sizes[size],
          height: sizes[size],
          borderRadius: borderRadius[variant],
          backgroundColor: source ? 'transparent' : defaultBg,
        },
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: sizes[size],
              height: sizes[size],
              borderRadius: borderRadius[variant],
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: fontSizes[size],
              color: colors.surface[theme],
            },
          ]}
        >
          {initials || '?'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
