/**
 * Error Handling and Logging System
 */

import {ERROR_MESSAGES} from './constants';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  DATABASE = 'database',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  IAP = 'iap',
  EXPORT = 'export',
  CAPTURE = 'capture',
  RENDERING = 'rendering',
  UNKNOWN = 'unknown',
}

export interface AppError {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  stack?: string;
  context?: Record<string, any>;
}

// ============================================================================
// Error Handler
// ============================================================================

class ErrorHandlerImpl {
  private errors: AppError[] = [];
  private maxErrors: number = 100;
  private onError?: (error: AppError) => void;

  // Set error callback
  setOnError(callback: (error: AppError) => void): void {
    this.onError = callback;
  }

  // Handle error
  handle(
    error: Error | string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>,
  ): AppError {
    const appError: AppError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: typeof error === 'string' ? error : error.message,
      category,
      severity,
      timestamp: Date.now(),
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
    };

    // Store error
    this.errors.push(appError);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console
    this.logError(appError);

    // Call callback if set
    if (this.onError) {
      this.onError(appError);
    }

    // In production, send to error tracking service (Sentry, etc.)
    this.reportToService(appError);

    return appError;
  }

  // Log error to console
  private logError(error: AppError): void {
    const prefix = `[${error.severity.toUpperCase()}] [${error.category}]`;

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error(prefix, error.message, error.context);
        if (error.stack) console.error(error.stack);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(prefix, error.message, error.context);
        break;
      case ErrorSeverity.LOW:
        console.log(prefix, error.message, error.context);
        break;
    }
  }

  // Report to error tracking service
  private reportToService(error: AppError): void {
    // In production, send to Sentry or similar
    // Sentry.captureException(error);
  }

  // Get all errors
  getErrors(): AppError[] {
    return [...this.errors];
  }

  // Get errors by category
  getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errors.filter(e => e.category === category);
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errors.filter(e => e.severity === severity);
  }

  // Clear errors
  clearErrors(): void {
    this.errors = [];
  }

  // Handle specific error types
  handleDatabaseError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.DATABASE, ErrorSeverity.HIGH, context);
  }

  handleNetworkError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.NETWORK, ErrorSeverity.MEDIUM, context);
  }

  handleValidationError(message: string, context?: Record<string, any>): AppError {
    return this.handle(message, ErrorCategory.VALIDATION, ErrorSeverity.LOW, context);
  }

  handlePermissionError(message: string, context?: Record<string, any>): AppError {
    return this.handle(message, ErrorCategory.PERMISSION, ErrorSeverity.HIGH, context);
  }

  handleIAPError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.IAP, ErrorSeverity.MEDIUM, context);
  }

  handleExportError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.EXPORT, ErrorSeverity.MEDIUM, context);
  }

  handleCaptureError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.CAPTURE, ErrorSeverity.MEDIUM, context);
  }

  handleRenderingError(error: Error, context?: Record<string, any>): AppError {
    return this.handle(error, ErrorCategory.RENDERING, ErrorSeverity.LOW, context);
  }
}

export const errorHandler = new ErrorHandlerImpl();

// ============================================================================
// Logger
// ============================================================================

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

class LoggerImpl {
  private logs: {level: LogLevel; message: string; timestamp: number; data?: any}[] = [];
  private maxLogs: number = 1000;
  private logLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;

  // Set log level
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  // Check if should log
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  // Log debug
  debug(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    this.addLog(LogLevel.DEBUG, message, data);
    console.log(`[DEBUG] ${message}`, data);
  }

  // Log info
  info(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    this.addLog(LogLevel.INFO, message, data);
    console.log(`[INFO] ${message}`, data);
  }

  // Log warning
  warn(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    this.addLog(LogLevel.WARN, message, data);
    console.warn(`[WARN] ${message}`, data);
  }

  // Log error
  error(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    this.addLog(LogLevel.ERROR, message, data);
    console.error(`[ERROR] ${message}`, data);
  }

  // Add log entry
  private addLog(level: LogLevel, message: string, data?: any): void {
    this.logs.push({
      level,
      message,
      timestamp: Date.now(),
      data,
    });

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  // Get logs
  getLogs(): typeof this.logs {
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Export logs as string
  exportLogs(): string {
    return this.logs
      .map(log => {
        const timestamp = new Date(log.timestamp).toISOString();
        const data = log.data ? ` | ${JSON.stringify(log.data)}` : '';
        return `[${timestamp}] [${log.level.toUpperCase()}] ${log.message}${data}`;
      })
      .join('\n');
  }
}

export const logger = new LoggerImpl();

// ============================================================================
// Global Error Boundary Helper
// ============================================================================

export function setupGlobalErrorHandler(): void {
  // Handle unhandled promise rejections
  const handlePromiseRejection = (event: PromiseRejectionEvent) => {
    errorHandler.handle(
      event.reason || 'Unhandled promise rejection',
      ErrorCategory.UNKNOWN,
      ErrorSeverity.HIGH,
      {
        promise: event.promise,
      },
    );
  };

  // In React Native, use ErrorUtils
  if (typeof ErrorUtils !== 'undefined') {
    const defaultHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      errorHandler.handle(error, ErrorCategory.UNKNOWN, ErrorSeverity.CRITICAL, {
        isFatal,
      });

      // Call default handler
      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });
  }

  logger.info('Global error handler set up');
}
