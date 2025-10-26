/**
 * Analytics and Crash Reporting Service
 * Integrates with popular analytics platforms:
 * - Firebase Analytics
 * - Sentry for crash reporting
 * - Mixpanel for advanced analytics
 */

import { Platform } from 'react-native';

// Analytics event types
export enum AnalyticsEvent {
  // User Actions
  PROJECT_CREATED = 'project_created',
  PROJECT_OPENED = 'project_opened',
  PROJECT_DELETED = 'project_deleted',
  PLAN_CREATED = 'plan_created',
  PLAN_EXPORTED = 'plan_exported',

  // Editor Actions
  WALL_DRAWN = 'wall_drawn',
  ROOM_CREATED = 'room_created',
  OBJECT_PLACED = 'object_placed',
  OBJECT_DELETED = 'object_deleted',
  EDITOR_TOOL_CHANGED = 'editor_tool_changed',

  // AR/LiDAR
  AR_SESSION_STARTED = 'ar_session_started',
  AR_CAPTURE_STARTED = 'ar_capture_started',
  AR_CAPTURE_COMPLETED = 'ar_capture_completed',
  LIDAR_SCAN_COMPLETED = 'lidar_scan_completed',

  // Export
  EXPORT_PDF = 'export_pdf',
  EXPORT_SVG = 'export_svg',
  EXPORT_DXF = 'export_dxf',
  EXPORT_PNG = 'export_png',

  // IAP
  PURCHASE_INITIATED = 'purchase_initiated',
  PURCHASE_COMPLETED = 'purchase_completed',
  PURCHASE_FAILED = 'purchase_failed',
  PURCHASE_RESTORED = 'purchase_restored',

  // Settings
  THEME_CHANGED = 'theme_changed',
  UNITS_CHANGED = 'units_changed',
  GRID_SIZE_CHANGED = 'grid_size_changed',

  // Performance
  APP_LAUNCHED = 'app_launched',
  APP_BACKGROUNDED = 'app_backgrounded',
  APP_FOREGROUNDED = 'app_foregrounded',
  SCREEN_VIEW = 'screen_view',
}

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface UserProperties {
  userId?: string;
  isPro?: boolean;
  totalProjects?: number;
  totalPlans?: number;
  createdAt?: string;
  lastActiveAt?: string;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private userId?: string;
  private userProperties: UserProperties = {};

  // Initialize analytics services
  async initialize() {
    try {
      // TODO: Initialize Firebase Analytics
      // await analytics().setAnalyticsCollectionEnabled(true);

      // TODO: Initialize Sentry
      // Sentry.init({
      //   dsn: 'YOUR_SENTRY_DSN',
      //   enableAutoSessionTracking: true,
      //   tracesSampleRate: 1.0,
      // });

      // TODO: Initialize Mixpanel
      // await Mixpanel.init('YOUR_MIXPANEL_TOKEN');

      this.logEvent(AnalyticsEvent.APP_LAUNCHED, {
        platform: Platform.OS,
        version: Platform.Version,
      });
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  // Log events
  logEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (!this.isEnabled) return;

    try {
      const enrichedProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
        userId: this.userId,
      };

      // Firebase Analytics
      // analytics().logEvent(event, enrichedProperties);

      // Mixpanel
      // Mixpanel.track(event, enrichedProperties);

      // Console log in development
      if (__DEV__) {
        console.log('[Analytics]', event, enrichedProperties);
      }
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  // Screen tracking
  logScreenView(screenName: string, properties?: AnalyticsProperties) {
    this.logEvent(AnalyticsEvent.SCREEN_VIEW, {
      screen_name: screenName,
      ...properties,
    });
  }

  // User identification
  setUserId(userId: string) {
    this.userId = userId;

    try {
      // Firebase
      // analytics().setUserId(userId);

      // Sentry
      // Sentry.setUser({ id: userId });

      // Mixpanel
      // Mixpanel.identify(userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  // Set user properties
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };

    try {
      // Firebase
      // analytics().setUserProperties(properties);

      // Mixpanel
      // Mixpanel.getPeople().set(properties);

      // Sentry
      // Sentry.setContext('user', properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  // Track timing
  startTiming(name: string) {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      this.logEvent(`${name}_timing` as AnalyticsEvent, { duration });
    };
  }

  // Error tracking
  logError(error: Error, context?: Record<string, any>) {
    try {
      // Sentry
      // Sentry.captureException(error, { contexts: { custom: context } });

      // Firebase Crashlytics
      // crashlytics().recordError(error);

      console.error('[Analytics] Error:', error, context);
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  // Set custom context
  setContext(key: string, value: Record<string, any>) {
    try {
      // Sentry
      // Sentry.setContext(key, value);
    } catch (error) {
      console.error('Failed to set context:', error);
    }
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;

    try {
      // Firebase
      // analytics().setAnalyticsCollectionEnabled(enabled);

      // Sentry
      // if (enabled) {
      //   Sentry.init({ ... });
      // } else {
      //   Sentry.close();
      // }
    } catch (error) {
      console.error('Failed to set analytics enabled:', error);
    }
  }

  // Track revenue (IAP)
  logRevenue(amount: number, currency: string, productId: string) {
    this.logEvent(AnalyticsEvent.PURCHASE_COMPLETED, {
      value: amount,
      currency,
      product_id: productId,
    });

    try {
      // Mixpanel revenue tracking
      // Mixpanel.getPeople().trackCharge(amount, {
      //   product_id: productId,
      //   currency,
      // });

      // Firebase revenue event
      // analytics().logEvent('purchase', {
      //   value: amount,
      //   currency,
      //   items: [{ item_id: productId }],
      // });
    } catch (error) {
      console.error('Failed to log revenue:', error);
    }
  }

  // Get user properties
  getUserProperties(): UserProperties {
    return this.userProperties;
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// React hook for analytics
export const useAnalytics = () => {
  const logEvent = (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
    analytics.logEvent(event, properties);
  };

  const logScreenView = (screenName: string, properties?: AnalyticsProperties) => {
    analytics.logScreenView(screenName, properties);
  };

  const logError = (error: Error, context?: Record<string, any>) => {
    analytics.logError(error, context);
  };

  return {
    logEvent,
    logScreenView,
    logError,
    startTiming: analytics.startTiming.bind(analytics),
  };
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startMetric(name: string) {
    this.metrics.set(name, Date.now());
  }

  endMetric(name: string) {
    const startTime = this.metrics.get(name);
    if (!startTime) return;

    const duration = Date.now() - startTime;
    this.metrics.delete(name);

    analytics.logEvent(`${name}_performance` as AnalyticsEvent, {
      duration,
      metric_name: name,
    });

    return duration;
  }

  recordMetric(name: string, value: number, unit: string = 'ms') {
    analytics.logEvent(`${name}_metric` as AnalyticsEvent, {
      value,
      unit,
      metric_name: name,
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Breadcrumbs for debugging
export const addBreadcrumb = (message: string, data?: Record<string, any>) => {
  try {
    // Sentry.addBreadcrumb({
    //   message,
    //   data,
    //   timestamp: Date.now() / 1000,
    // });

    if (__DEV__) {
      console.log('[Breadcrumb]', message, data);
    }
  } catch (error) {
    console.error('Failed to add breadcrumb:', error);
  }
};

export default analytics;
