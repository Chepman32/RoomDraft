import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  type: 'room' | 'wall' | 'object' | 'measurement';
}

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId?: string;
  onLayerSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onToggleVisibility,
  onToggleLock,
}) => {
  const { theme } = useTheme();

  const renderLayer = ({ item, index }: { item: Layer; index: number }) => (
    <LayerItem
      layer={item}
      selected={item.id === selectedLayerId}
      onSelect={() => onLayerSelect(item.id)}
      onToggleVisibility={() => onToggleVisibility(item.id)}
      onToggleLock={() => onToggleLock(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface[theme] }]}>
      <View style={[styles.header, { borderBottomColor: colors.border[theme] }]}>
        <Text style={[styles.title, { color: colors.text[theme] }]}>
          Layers
        </Text>
      </View>

      <FlatList
        data={layers}
        renderItem={renderLayer}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const LayerItem: React.FC<{
  layer: Layer;
  selected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
}> = ({ layer, selected, onSelect, onToggleVisibility, onToggleLock }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const bgProgress = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    bgProgress.value = withSpring(selected ? 1 : 0, {
      stiffness: 240,
      damping: 18,
    });
  }, [selected]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      bgProgress.value > 0.5
        ? colors.primaryContainer[theme]
        : colors.surface[theme],
  }));

  const getLayerIcon = () => {
    const iconColors = {
      room: '#34C759',
      wall: '#007AFF',
      object: '#FF9500',
      measurement: '#5856D6',
    };

    return (
      <View
        style={[
          styles.layerIcon,
          { backgroundColor: iconColors[layer.type] || colors.textSecondary[theme] },
        ]}
      />
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.layerItem}
      >
        {getLayerIcon()}

        <Text
          style={[
            styles.layerName,
            { color: colors.text[theme] },
            !layer.visible && styles.layerNameHidden,
          ]}
          numberOfLines={1}
        >
          {layer.name}
        </Text>

        <View style={styles.controls}>
          <Pressable
            onPress={onToggleVisibility}
            style={styles.controlButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View
              style={[
                styles.visibilityIcon,
                {
                  backgroundColor: layer.visible
                    ? colors.textSecondary[theme]
                    : colors.textTertiary[theme],
                },
              ]}
            />
          </Pressable>

          <Pressable
            onPress={onToggleLock}
            style={styles.controlButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View
              style={[
                styles.lockIcon,
                {
                  backgroundColor: layer.locked
                    ? colors.error[theme]
                    : colors.textTertiary[theme],
                },
              ]}
            />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    maxHeight: '80%',
    borderRadius: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.title3,
    fontWeight: '600',
  },
  list: {
    maxHeight: 400,
  },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  layerIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  layerName: {
    ...typography.body,
    flex: 1,
  },
  layerNameHidden: {
    opacity: 0.5,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibilityIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  lockIcon: {
    width: 12,
    height: 14,
    borderRadius: 3,
  },
});
