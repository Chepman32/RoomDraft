/**
 * Settings Screen
 * App settings and IAP
 */

import React from 'react';
import {View, StyleSheet, Text, Pressable, ScrollView, Switch} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useThemeStore} from '@stores/themeStore';
import {useIAPStore} from '@stores/iapStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing} from '@design/spacing';
import {RootStackParamList} from '@types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {isDarkMode, toggleDarkMode} = useThemeStore();
  const {isProActive} = useIAPStore();

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const primaryColor = getColor(colors.primary, isDarkMode);
  const surfaceColor = getColor(colors.surfaceElevated, isDarkMode);

  const handleUpgradeToPro = () => {
    // In production: trigger IAP flow
    console.log('Upgrade to Pro');
  };

  return (
    <View style={[styles.container, {backgroundColor, paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.closeText, {color: primaryColor}]}>✕ Close</Text>
        </Pressable>
        <Text style={[styles.headerTitle, {color: textColor}]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Pro Section */}
        <View style={[styles.section, {backgroundColor: surfaceColor}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            {isProActive ? '✓ Pro Active' : 'Upgrade to Pro'}
          </Text>
          {!isProActive && (
            <>
              <Text style={[styles.sectionDescription, {color: textColor, opacity: 0.7}]}>
                Unlock unlimited plans, DXF export, and furniture library
              </Text>
              <Pressable
                style={[styles.upgradeButton, {backgroundColor: primaryColor}]}
                onPress={handleUpgradeToPro}>
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Appearance */}
        <View style={styles.settingItem}>
          <View>
            <Text style={[styles.settingLabel, {color: textColor}]}>Dark Mode</Text>
            <Text style={[styles.settingDescription, {color: textColor, opacity: 0.6}]}>
              Switch between light and dark theme
            </Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, {color: textColor, opacity: 0.6}]}>
            RoomDraft v1.0.0
          </Text>
          <Text style={[styles.infoText, {color: textColor, opacity: 0.6}]}>
            Offline Floor Plan & LiDAR Measure
          </Text>
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
  closeText: {
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
  section: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  upgradeButton: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLabel: {
    ...typography.headline,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    ...typography.caption1,
  },
  infoSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  infoText: {
    ...typography.caption1,
    marginBottom: spacing.xs,
  },
});
