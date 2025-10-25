/**
 * Projects List Screen
 * Main screen showing all projects with Skia rendering
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, Text, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useThemeStore} from '@stores/themeStore';
import {useProjectsStore} from '@stores/projectsStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing, layout} from '@design/spacing';
import {RootStackParamList, Project} from '@types/index';
import {formatRelativeTime} from '@utils/formatters';
import {v4 as uuidv4} from 'uuid';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProjectsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const {projects, addProject} = useProjectsStore();

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const surfaceColor = getColor(colors.surfaceElevated, isDarkMode);

  useEffect(() => {
    // Add sample project if none exist
    if (projects.length === 0) {
      const sampleProject: Project = {
        id: uuidv4(),
        title: 'Sample Floor Plan',
        description: 'My first floor plan project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPro: false,
      };
      addProject(sampleProject);
    }
  }, [projects.length, addProject]);

  const handleCreateProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      title: `Project ${projects.length + 1}`,
      description: 'New floor plan project',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPro: false,
    };
    addProject(newProject);
  };

  const renderProject = ({item}: {item: Project}) => (
    <Pressable
      style={[styles.projectCard, {backgroundColor: surfaceColor}]}
      onPress={() => navigation.navigate('ProjectDetail', {projectId: item.id})}>
      <Text style={[styles.projectTitle, {color: textColor}]}>{item.title}</Text>
      {item.description && (
        <Text style={[styles.projectDescription, {color: textColor, opacity: 0.7}]}>
          {item.description}
        </Text>
      )}
      <Text style={[styles.projectDate, {color: textColor, opacity: 0.5}]}>
        {formatRelativeTime(item.updatedAt)}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, {backgroundColor, paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: textColor}]}>RoomDraft</Text>
        <Pressable
          style={[styles.settingsButton]}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={[styles.settingsText, {color: textColor}]}>Settings</Text>
        </Pressable>
      </View>

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, {color: textColor}]}>
              No projects yet. Create your first one!
            </Text>
          </View>
        }
      />

      <View style={[styles.fabContainer, {bottom: insets.bottom + spacing.md}]}>
        <Pressable
          style={[
            styles.fab,
            {backgroundColor: getColor(colors.primary, isDarkMode)},
          ]}
          onPress={handleCreateProject}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.largeTitle,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsText: {
    ...typography.body,
  },
  listContent: {
    padding: spacing.md,
  },
  projectCard: {
    padding: spacing.md,
    borderRadius: layout.radiusMedium,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectTitle: {
    ...typography.title2,
    marginBottom: spacing.xs,
  },
  projectDescription: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  projectDate: {
    ...typography.caption1,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.md,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
