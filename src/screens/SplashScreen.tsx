/**
 * Splash Screen - Physics-based particle animation with Skia
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  Canvas,
  Group,
  Circle,
  useValue,
  runTiming,
  Easing,
  useComputedValue,
  vec,
} from '@shopify/react-native-skia';
import {useThemeStore} from '@stores/themeStore';
import {colors} from '@design/colors';

const {width, height} = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const SplashScreen: React.FC = () => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const progress = useValue(0);

  useEffect(() => {
    runTiming(progress, 1, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const bgColor = isDarkMode ? colors.background.dark : colors.background.light;
  const primaryColor = isDarkMode ? colors.primary.dark : colors.primary.light;

  // Generate particles
  const particles: Particle[] = Array.from({length: 50}, (_, i) => ({
    id: i,
    x: width / 2,
    y: height / 2,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    radius: Math.random() * 3 + 1,
    color: primaryColor,
  }));

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <Canvas style={styles.canvas}>
        <Group>
          {particles.map(particle => {
            const cx = useComputedValue(() => {
              return particle.x + particle.vx * progress.current * 100;
            }, [progress]);

            const cy = useComputedValue(() => {
              return particle.y + particle.vy * progress.current * 100;
            }, [progress]);

            const opacity = useComputedValue(() => {
              return 1 - progress.current;
            }, [progress]);

            return (
              <Circle
                key={particle.id}
                cx={cx}
                cy={cy}
                r={particle.radius}
                color={particle.color}
                opacity={opacity}
              />
            );
          })}
          {/* Center logo circle */}
          <Circle cx={width / 2} cy={height / 2} r={40} color={primaryColor} />
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
