/**
 * Local Notification Service
 * Handles local notifications for the app
 */

import {Platform} from 'react-native';

// Types for notifications
export interface NotificationOptions {
  id: string;
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  data?: any;
  fireDate?: Date;
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week';
}

export interface ScheduledNotification {
  id: string;
  fireDate: Date;
  title: string;
  body: string;
}

// ============================================================================
// Notification Service Implementation
// ============================================================================

class NotificationServiceImpl {
  private isInitialized: boolean = false;

  // Initialize notifications
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (Platform.OS === 'ios') {
        // In production with @react-native-community/push-notification-ios:
        // await PushNotificationIOS.requestPermissions();
        console.log('iOS notifications initialized');
      } else {
        // Android setup
        console.log('Android notifications initialized');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Notification initialization failed:', error);
    }
  }

  // Request permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // In production:
        // const permissions = await PushNotificationIOS.requestPermissions();
        // return permissions.alert || permissions.badge || permissions.sound;

        return true; // Mock
      }

      return true; // Android doesn't need explicit permission for local notifications
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  // Schedule a local notification
  async scheduleNotification(options: NotificationOptions): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (Platform.OS === 'ios') {
        // In production with @react-native-community/push-notification-ios:
        // PushNotificationIOS.scheduleLocalNotification({
        //   alertTitle: options.title,
        //   alertBody: options.body,
        //   fireDate: options.fireDate?.toISOString(),
        //   userInfo: options.data,
        // });

        console.log('iOS notification scheduled:', options);
      } else {
        // Android notification scheduling
        console.log('Android notification scheduled:', options);
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  // Show immediate notification
  async showNotification(options: Omit<NotificationOptions, 'fireDate'>): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (Platform.OS === 'ios') {
        // In production:
        // PushNotificationIOS.presentLocalNotification({
        //   alertTitle: options.title,
        //   alertBody: options.body,
        //   userInfo: options.data,
        // });

        console.log('iOS notification shown:', options);
      } else {
        // Android notification
        console.log('Android notification shown:', options);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Cancel notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // In production:
        // PushNotificationIOS.removeDeliveredNotifications([notificationId]);

        console.log('iOS notification cancelled:', notificationId);
      } else {
        // Android cancel
        console.log('Android notification cancelled:', notificationId);
      }
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // In production:
        // PushNotificationIOS.removeAllDeliveredNotifications();

        console.log('All iOS notifications cancelled');
      } else {
        // Android cancel all
        console.log('All Android notifications cancelled');
      }
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      if (Platform.OS === 'ios') {
        // In production:
        // const notifications = await PushNotificationIOS.getScheduledLocalNotifications();
        // return notifications;

        return []; // Mock
      }

      return []; // Android
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  // Get badge count (iOS only)
  async getBadgeCount(): Promise<number> {
    if (Platform.OS !== 'ios') return 0;

    try {
      // In production:
      // return await PushNotificationIOS.getApplicationIconBadgeNumber();

      return 0; // Mock
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  // Set badge count (iOS only)
  async setBadgeCount(count: number): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      // In production:
      // PushNotificationIOS.setApplicationIconBadgeNumber(count);

      console.log('Badge count set to:', count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  // Clear badge (iOS only)
  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }
}

export const notificationService = new NotificationServiceImpl();

// ============================================================================
// Predefined Notifications
// ============================================================================

export const NotificationTemplates = {
  // Export completed
  exportCompleted: (fileName: string): NotificationOptions => ({
    id: `export_${Date.now()}`,
    title: 'Export Complete',
    body: `Your floor plan has been exported to ${fileName}`,
    sound: 'default',
  }),

  // Project reminder
  projectReminder: (projectName: string, daysAgo: number): NotificationOptions => ({
    id: `reminder_${Date.now()}`,
    title: 'Project Reminder',
    body: `You haven't worked on "${projectName}" in ${daysAgo} days`,
    sound: 'default',
    fireDate: new Date(Date.now() + 60000), // 1 minute from now (for demo)
  }),

  // Pro upgrade prompt
  proUpgrade: (): NotificationOptions => ({
    id: `pro_${Date.now()}`,
    title: 'Upgrade to Pro',
    body: 'Unlock unlimited plans and advanced export formats',
    sound: 'default',
  }),

  // Capture success
  captureSuccess: (): NotificationOptions => ({
    id: `capture_${Date.now()}`,
    title: 'Capture Successful',
    body: 'Your floor plan has been captured successfully',
    sound: 'default',
  }),

  // Backup reminder
  backupReminder: (): NotificationOptions => ({
    id: `backup_${Date.now()}`,
    title: 'Backup Reminder',
    body: 'Remember to export your projects for safekeeping',
    sound: 'default',
    repeatInterval: 'week',
  }),
};
