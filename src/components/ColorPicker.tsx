import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { Slider } from './Slider';

export const PRESET_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE',
  '#30B0C7', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
  '#A2845E', '#8E8E93', '#000000', '#FFFFFF',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  showPresets?: boolean;
  showCustom?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  showPresets = true,
  showCustom = true,
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  React.useEffect(() => {
    if (mode === 'custom') {
      const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      onChange(hslColor);
    }
  }, [hue, saturation, lightness, mode]);

  const renderPresetColor = ({ item: color }: { item: string }) => (
    <ColorSwatch
      color={color}
      selected={value === color}
      onPress={() => {
        onChange(color);
        setMode('presets');
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <View style={[styles.previewSwatch, { backgroundColor: value }]} />
        <Text style={[styles.previewLabel, { color: colors.text[theme] }]}>
          Current: {value}
        </Text>
      </View>

      {showPresets && showCustom && (
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setMode('presets')}
            style={[
              styles.tab,
              mode === 'presets' && {
                backgroundColor: colors.primaryContainer[theme],
              },
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    mode === 'presets'
                      ? colors.primary[theme]
                      : colors.textSecondary[theme],
                },
              ]}
            >
              Presets
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('custom')}
            style={[
              styles.tab,
              mode === 'custom' && {
                backgroundColor: colors.primaryContainer[theme],
              },
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    mode === 'custom'
                      ? colors.primary[theme]
                      : colors.textSecondary[theme],
                },
              ]}
            >
              Custom
            </Text>
          </Pressable>
        </View>
      )}

      {mode === 'presets' && showPresets && (
        <FlatList
          data={PRESET_COLORS}
          renderItem={renderPresetColor}
          keyExtractor={(item) => item}
          numColumns={7}
          contentContainerStyle={styles.presetsGrid}
        />
      )}

      {mode === 'custom' && showCustom && (
        <View style={styles.customPicker}>
          <Slider
            label="Hue"
            value={hue}
            onValueChange={setHue}
            minimumValue={0}
            maximumValue={360}
            showValue
          />
          <Slider
            label="Saturation"
            value={saturation}
            onValueChange={setSaturation}
            minimumValue={0}
            maximumValue={100}
            showValue
            formatValue={(v) => `${v}%`}
          />
          <Slider
            label="Lightness"
            value={lightness}
            onValueChange={setLightness}
            minimumValue={0}
            maximumValue={100}
            showValue
            formatValue={(v) => `${v}%`}
          />
        </View>
      )}
    </View>
  );
};

const ColorSwatch: React.FC<{
  color: string;
  selected: boolean;
  onPress: () => void;
}> = ({ color, selected, onPress }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.swatch,
          { backgroundColor: color },
          selected && {
            borderWidth: 3,
            borderColor: colors.primary[theme],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewSwatch: {
    width: 40,
    height: 40,
    borderRadius: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: '#00000020',
  },
  previewLabel: {
    ...typography.body,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  tabLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  presetsGrid: {
    gap: spacing.sm,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: spacing.sm,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: '#00000020',
  },
  customPicker: {
    gap: spacing.md,
  },
});
