import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { TextInput } from './TextInput';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onFocus,
  onBlur,
  autoFocus = false,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const clearScale = useSharedValue(0);

  React.useEffect(() => {
    clearScale.value = withSpring(value ? 1 : 0, { stiffness: 320, damping: 22 });
  }, [value]);

  const clearAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearScale.value }],
    opacity: clearScale.value,
  }));

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const SearchIcon = () => (
    <View style={styles.iconContainer}>
      <View style={[styles.searchIcon, { borderColor: colors.textTertiary[theme] }]} />
    </View>
  );

  const ClearButton = () => (
    <Animated.View style={clearAnimatedStyle}>
      <Pressable onPress={handleClear} style={styles.clearButton}>
        <View style={[styles.clearIcon, { backgroundColor: colors.textTertiary[theme] }]} />
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        variant="filled"
        leftIcon={<SearchIcon />}
        rightIcon={value ? <ClearButton /> : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  clearButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
