/**
 * Project Detail Screen
 * Shows plans for a specific project
 */

import React from 'react';
import {View, StyleSheet, Text, Pressable, FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useThemeStore} from '@stores/themeStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing} from '@design/spacing';
import {RootStackParamList} from '@types/index';
import {v4 as uuidv4} from 'uuid';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

export const ProjectDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const {projectId} = route.params;

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const primaryColor = getColor(colors.primary, isDarkMode);

  const handleStartCapture = () => {
    const planId = uuidv4();
    navigation.navigate('ARCapture', {planId});
  };

  const handleStartManual = () => {
    const planId = uuidv4();
    navigation.navigate('Editor', {planId});
  };

  return (
    <View style={[styles.container, {backgroundColor, paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, {color: primaryColor}]}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, {color: textColor}]}>Project Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, {color: textColor}]}>Create New Plan</Text>

        <Pressable
          style={[styles.actionButton, {backgroundColor: primaryColor}]}
          onPress={handleStartCapture}>
          <Text style={styles.actionButtonText}>AR / LiDAR Capture</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, {backgroundColor: primaryColor}]}
          onPress={handleStartManual}>
          <Text style={styles.actionButtonText}>Manual Drawing</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>Saved Plans</Text>
          <Text style={[styles.emptyText, {color: textColor, opacity: 0.6}]}>
            No plans yet. Create your first one above.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    ...typography.body,
  },
  headerTitle: {
    ...typography.largeTitle,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.title2,
    marginBottom: spacing.md,
  },
  actionButton: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
  section: {
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body,
  },
});
