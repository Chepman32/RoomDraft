import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  variant?: 'fixed' | 'scrollable';
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'fixed',
}) => {
  const { theme } = useTheme();
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface[theme] }]}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            onPress={() => onTabChange(tab.id)}
            flex={variant === 'fixed'}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary[theme] },
          {
            left: `${(activeIndex / tabs.length) * 100}%`,
            width: `${100 / tabs.length}%`,
          },
        ]}
      />
    </View>
  );
};

const TabItem: React.FC<{
  tab: Tab;
  active: boolean;
  onPress: () => void;
  flex: boolean;
}> = ({ tab, active, onPress, flex }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(active ? 1 : 0);

  React.useEffect(() => {
    colorProgress.value = withSpring(active ? 1 : 0, {
      stiffness: 240,
      damping: 18,
    });
  }, [active]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { stiffness: 320, damping: 22 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 320, damping: 22 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(colorProgress.value, [0, 1], [0.7, 1]);

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[flex && styles.flexTab, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.tab}
      >
        {tab.icon && <View style={styles.icon}>{tab.icon}</View>}
        <Animated.Text
          style={[
            styles.label,
            {
              color: active ? colors.primary[theme] : colors.textSecondary[theme],
            },
            textAnimatedStyle,
          ]}
        >
          {tab.label}
        </Animated.Text>
        {tab.badge !== undefined && tab.badge > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error[theme] }]}>
            <Text style={styles.badgeText}>
              {tab.badge > 99 ? '99+' : tab.badge}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  flexTab: {
    flex: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xxs,
  },
  badgeText: {
    ...typography.caption2,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
  },
});
