/**
 * Editor Screen
 * 2D Floor Plan Editor with Skia rendering
 */

import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Canvas, Rect, Line, vec} from '@shopify/react-native-skia';
import {useThemeStore} from '@stores/themeStore';
import {useEditorStore} from '@stores/editorStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing} from '@design/spacing';
import {RootStackParamList} from '@types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Editor'>;

export const EditorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const {mode, showGrid, showMeasurements} = useEditorStore();

  const {planId} = route.params;

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const primaryColor = getColor(colors.primary, isDarkMode);
  const gridColor = getColor(colors.border, isDarkMode);

  const handleExport = () => {
    navigation.navigate('Export', {planId});
  };

  return (
    <View style={[styles.container, {backgroundColor, paddingTop: insets.top}]}>
      {/* Top toolbar */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.toolbarButton, {color: primaryColor}]}>← Back</Text>
        </Pressable>
        <Text style={[styles.toolbarTitle, {color: textColor}]}>Floor Plan Editor</Text>
        <Pressable onPress={handleExport}>
          <Text style={[styles.toolbarButton, {color: primaryColor}]}>Export</Text>
        </Pressable>
      </View>

      {/* Canvas area */}
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas}>
          {/* Background */}
          <Rect x={0} y={0} width={1000} height={1000} color={backgroundColor} />

          {/* Grid (if enabled) */}
          {showGrid && (
            <>
              {Array.from({length: 20}).map((_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <Line
                    p1={vec(i * 50, 0)}
                    p2={vec(i * 50, 1000)}
                    color={gridColor}
                    style="stroke"
                    strokeWidth={0.5}
                  />
                  <Line
                    p1={vec(0, i * 50)}
                    p2={vec(1000, i * 50)}
                    color={gridColor}
                    style="stroke"
                    strokeWidth={0.5}
                  />
                </React.Fragment>
              ))}
            </>
          )}

          {/* Sample room */}
          <Rect
            x={200}
            y={200}
            width={300}
            height={400}
            color={primaryColor}
            opacity={0.3}
          />
        </Canvas>
      </View>

      {/* Bottom toolbar */}
      <View style={[styles.bottomToolbar, {paddingBottom: insets.bottom}]}>
        <Text style={[styles.modeText, {color: textColor}]}>
          Mode: {mode.toUpperCase()}
        </Text>
        <View style={styles.toolButtons}>
          <Pressable style={[styles.toolButton, {backgroundColor: primaryColor}]}>
            <Text style={styles.toolButtonText}>Select</Text>
          </Pressable>
          <Pressable style={[styles.toolButton, {backgroundColor: primaryColor}]}>
            <Text style={styles.toolButtonText}>Draw Wall</Text>
          </Pressable>
          <Pressable style={[styles.toolButton, {backgroundColor: primaryColor}]}>
            <Text style={styles.toolButtonText}>Add Object</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  toolbarButton: {
    ...typography.body,
  },
  toolbarTitle: {
    ...typography.headline,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  bottomToolbar: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modeText: {
    ...typography.caption1,
    marginBottom: spacing.sm,
  },
  toolButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toolButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  toolButtonText: {
    ...typography.caption1,
    color: '#FFFFFF',
  },
});
