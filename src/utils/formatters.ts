/**
 * Formatting Utilities
 */

import {format} from 'date-fns';

// ============================================================================
// Number Formatting
// ============================================================================

export const formatMeters = (meters: number, decimals: number = 2): string => {
  return `${meters.toFixed(decimals)}m`;
};

export const formatSquareMeters = (sqm: number, decimals: number = 2): string => {
  return `${sqm.toFixed(decimals)}m²`;
};

export const formatCentimeters = (meters: number): string => {
  return `${Math.round(meters * 100)}cm`;
};

export const formatDegrees = (degrees: number): string => {
  return `${Math.round(degrees)}°`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

// ============================================================================
// Date Formatting
// ============================================================================

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return formatDate(dateString);
};

// ============================================================================
// Text Formatting
// ============================================================================

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
