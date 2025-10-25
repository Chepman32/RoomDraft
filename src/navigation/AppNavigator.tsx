/**
 * Main App Navigator
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types/index';

// Screens (to be implemented)
import {ProjectsListScreen} from '@screens/ProjectsListScreen';
import {ProjectDetailScreen} from '@screens/ProjectDetailScreen';
import {ARCaptureScreen} from '@screens/ARCaptureScreen';
import {EditorScreen} from '@screens/EditorScreen';
import {ExportScreen} from '@screens/ExportScreen';
import {SettingsScreen} from '@screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProjectsList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}>
      <Stack.Screen name="ProjectsList" component={ProjectsListScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen
        name="ARCapture"
        component={ARCaptureScreen}
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          gestureEnabled: false, // Prevent accidental swipe-back during editing
        }}
      />
      <Stack.Screen name="Export" component={ExportScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
