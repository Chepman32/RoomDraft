/**
 * RoomDraft - Main App Component
 * Offline Floor Plan & LiDAR Measure
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {initializeDatabase} from '@database/init';
import {useThemeStore} from '@stores/themeStore';
import {AppNavigator} from '@navigation/AppNavigator';
import {SplashScreen} from '@screens/SplashScreen';

const App = (): React.JSX.Element => {
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize database
        await initializeDatabase();

        // Small delay for splash animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true); // Proceed anyway to avoid blocking
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
