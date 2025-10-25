/**
 * AR Capture Screen
 * LiDAR/AR capture interface
 */

import React, {useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useThemeStore} from '@stores/themeStore';
import {useCaptureStore} from '@stores/captureStore';
import {colors, getColor} from '@design/colors';
import {typography} from '@design/typography';
import {spacing} from '@design/spacing';
import {RootStackParamList} from '@types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ARCapture'>;

export const ARCaptureScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const {isCapturing, setCapturing, captureMode} = useCaptureStore();

  const {planId} = route.params;

  const backgroundColor = getColor(colors.background, isDarkMode);
  const textColor = getColor(colors.textPrimary, isDarkMode);
  const primaryColor = getColor(colors.primary, isDarkMode);

  const handleStartCapture = () => {
    setCapturing(true);
    // In production: initialize ARKit/LiDAR session
  };

  const handleStopCapture = () => {
    setCapturing(false);
    // In production: process capture data and navigate to editor
    navigation.navigate('Editor', {planId});
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* AR View would go here */}
      <View style={styles.arViewPlaceholder}>
        <Text style={[styles.placeholderText, {color: textColor}]}>
          AR / LiDAR View
        </Text>
        <Text style={[styles.instructionText, {color: textColor, opacity: 0.7}]}>
          Point your device at the room and tap Scan
        </Text>
      </View>

      {/* Overlay UI */}
      <View style={[styles.overlay, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <View style={styles.topBar}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeText, {color: '#FFFFFF'}]}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.captureInfo}>
            <Text style={[styles.captureInfoText, {color: '#FFFFFF'}]}>
              Mode: {captureMode.toUpperCase()}
            </Text>
          </View>

          <Pressable
            style={[
              styles.captureButton,
              {backgroundColor: isCapturing ? '#F44336' : primaryColor},
            ]}
            onPress={isCapturing ? handleStopCapture : handleStartCapture}>
            <Text style={styles.captureButtonText}>
              {isCapturing ? 'Complete' : 'Scan'}
            </Text>
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
  arViewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    ...typography.title1,
    marginBottom: spacing.md,
  },
  instructionText: {
    ...typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topBar: {
    padding: spacing.md,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
  },
  bottomBar: {
    padding: spacing.md,
    alignItems: 'center',
  },
  captureInfo: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  captureInfoText: {
    ...typography.caption1,
  },
  captureButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 28,
    minWidth: 120,
    alignItems: 'center',
  },
  captureButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
});
