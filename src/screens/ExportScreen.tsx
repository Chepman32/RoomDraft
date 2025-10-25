/**
 * Export Screen
 * Export floor plans to PDF/SVG/DXF
 */

import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useThemeStore} from '@stores/themeStore';
import {useIAPStore} from '@stores/iapStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing} from '@design/spacing';
import {RootStackParamList} from '@types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Export'>;

type ExportFormat = 'pdf' | 'svg' | 'dxf' | 'png';

export const ExportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const {isProActive} = useIAPStore();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');

  const {planId} = route.params;

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const primaryColor = getColor(colors.primary, isDarkMode);
  const surfaceColor = getColor(colors.surfaceElevated, isDarkMode);

  const formats: {format: ExportFormat; label: string; proPonly: boolean}[] = [
    {format: 'pdf', label: 'PDF Document', proOnly: false},
    {format: 'png', label: 'PNG Image', proOnly: false},
    {format: 'svg', label: 'SVG Vector', proOnly: true},
    {format: 'dxf', label: 'DXF CAD', proOnly: true},
  ];

  const handleExport = () => {
    // In production: generate and save export
    console.log(`Exporting plan ${planId} as ${selectedFormat}`);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {backgroundColor, paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, {color: primaryColor}]}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, {color: textColor}]}>Export Plan</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.sectionTitle, {color: textColor}]}>Select Format</Text>

        {formats.map(({format, label, proOnly}) => {
          const isLocked = proOnly && !isProActive;
          const isSelected = selectedFormat === format;

          return (
            <Pressable
              key={format}
              style={[
                styles.formatOption,
                {
                  backgroundColor: surfaceColor,
                  borderColor: isSelected ? primaryColor : 'transparent',
                  borderWidth: 2,
                  opacity: isLocked ? 0.5 : 1,
                },
              ]}
              onPress={() => !isLocked && setSelectedFormat(format)}
              disabled={isLocked}>
              <View>
                <Text style={[styles.formatLabel, {color: textColor}]}>{label}</Text>
                {proOnly && (
                  <Text style={[styles.proLabel, {color: primaryColor}]}>
                    {isProActive ? '✓ Pro' : '🔒 Pro Only'}
                  </Text>
                )}
              </View>
              {isSelected && !isLocked && (
                <Text style={[styles.selectedIndicator, {color: primaryColor}]}>✓</Text>
              )}
            </Pressable>
          );
        })}

        <View style={styles.actions}>
          <Pressable
            style={[styles.exportButton, {backgroundColor: primaryColor}]}
            onPress={handleExport}>
            <Text style={styles.exportButtonText}>Export as {selectedFormat.toUpperCase()}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
  },
  backText: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.largeTitle,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.title2,
    marginBottom: spacing.md,
  },
  formatOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  formatLabel: {
    ...typography.headline,
    marginBottom: spacing.xs,
  },
  proLabel: {
    ...typography.caption1,
  },
  selectedIndicator: {
    fontSize: 24,
  },
  actions: {
    marginTop: spacing.xl,
  },
  exportButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
});
