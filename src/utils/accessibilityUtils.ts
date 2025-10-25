/**
 * Accessibility Utilities
 * Helpers for VoiceOver and accessibility features
 */

import {AccessibilityInfo, Platform} from 'react-native';

// ============================================================================
// Accessibility Manager
// ============================================================================

class AccessibilityManagerImpl {
  private isScreenReaderEnabled: boolean = false;
  private announcements: string[] = [];

  // Initialize
  async initialize(): Promise<void> {
    // Check if screen reader is enabled
    this.isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();

    // Listen for changes
    AccessibilityInfo.addEventListener('screenReaderChanged', this.handleScreenReaderChange);
  }

  // Handle screen reader change
  private handleScreenReaderChange = (enabled: boolean): void => {
    this.isScreenReaderEnabled = enabled;
    console.log('Screen reader changed:', enabled);
  };

  // Check if screen reader is enabled
  isScreenReaderActive(): boolean {
    return this.isScreenReaderEnabled;
  }

  // Announce message to screen reader
  announce(message: string, options?: {queue?: boolean}): void {
    if (!this.isScreenReaderEnabled) return;

    if (Platform.OS === 'ios') {
      // iOS VoiceOver announcement
      AccessibilityInfo.announceForAccessibility(message);
    } else {
      // Android TalkBack announcement
      AccessibilityInfo.announceForAccessibility(message);
    }

    // Store announcement history
    this.announcements.push(message);
    if (this.announcements.length > 10) {
      this.announcements.shift();
    }
  }

  // Get announcement history
  getAnnouncements(): string[] {
    return [...this.announcements];
  }

  // Cleanup
  cleanup(): void {
    AccessibilityInfo.removeEventListener('screenReaderChanged', this.handleScreenReaderChange);
  }
}

export const accessibilityManager = new AccessibilityManagerImpl();

// ============================================================================
// Accessibility Labels
// ============================================================================

export const AccessibilityLabels = {
  // Navigation
  backButton: 'Go back',
  closeButton: 'Close',
  menuButton: 'Open menu',
  settingsButton: 'Open settings',

  // Editor
  selectTool: 'Select tool',
  panTool: 'Pan tool',
  drawWallTool: 'Draw wall tool',
  drawRoomTool: 'Draw room tool',
  placeObjectTool: 'Place object tool',
  measureTool: 'Measurement tool',
  deleteTool: 'Delete tool',

  // Actions
  undo: 'Undo last action',
  redo: 'Redo last action',
  copy: 'Copy selection',
  paste: 'Paste',
  duplicate: 'Duplicate selection',
  delete: 'Delete selection',

  // Grid
  gridToggle: 'Toggle grid visibility',
  snapToggle: 'Toggle snap to grid',

  // Measurements
  toggleMeasurements: 'Toggle measurements display',
  toggleLabels: 'Toggle labels display',

  // Export
  exportPDF: 'Export as PDF',
  exportSVG: 'Export as SVG',
  exportDXF: 'Export as DXF (Pro only)',
  exportPNG: 'Export as PNG image',

  // IAP
  upgradeToPro: 'Upgrade to Pro',
  restorePurchases: 'Restore previous purchases',

  // Projects
  createProject: 'Create new project',
  openProject: 'Open project',
  deleteProject: 'Delete project',

  // Capture
  startCapture: 'Start capturing with AR/LiDAR',
  stopCapture: 'Stop capture',
  switchCaptureMode: 'Switch capture mode',
};

// ============================================================================
// Accessibility Hints
// ============================================================================

export const AccessibilityHints = {
  // Editor
  selectTool: 'Tap to select objects on the canvas',
  drawWallTool: 'Tap and drag to draw a wall',
  drawRoomTool: 'Tap to place points, close the shape to create a room',
  placeObjectTool: 'Tap to place the selected furniture item',

  // Actions
  undo: 'Undoes the last edit action',
  redo: 'Redoes the last undone action',

  // Projects
  projectCard: 'Double tap to open this project',
  createProject: 'Creates a new empty project',

  // Export
  exportButton: 'Exports your floor plan in the selected format',
};

// ============================================================================
// Dynamic Type Support
// ============================================================================

export const getDynamicFontSize = (baseSize: number, scale: number = 1): number => {
  // Apply user's preferred text size
  return Math.round(baseSize * scale);
};

// ============================================================================
// Color Contrast Utilities
// ============================================================================

export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In production, use a proper color library

  const getLuminance = (hex: string): number => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const [rLinear, gLinear, bLinear] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast meets WCAG AA standards
export const meetsWCAGAA = (textColor: string, backgroundColor: string): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return ratio >= 4.5; // 4.5:1 for normal text, 3:1 for large text
};

// Check if contrast meets WCAG AAA standards
export const meetsWCAGAAA = (textColor: string, backgroundColor: string): boolean => {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return ratio >= 7; // 7:1 for normal text, 4.5:1 for large text
};

// ============================================================================
// Accessibility Roles
// ============================================================================

export const AccessibilityRoles = {
  button: 'button' as const,
  link: 'link' as const,
  header: 'header' as const,
  search: 'search' as const,
  image: 'image' as const,
  imagebutton: 'imagebutton' as const,
  adjustable: 'adjustable' as const,
  summary: 'summary' as const,
  text: 'text' as const,
  none: 'none' as const,
};

// ============================================================================
// Gesture Descriptions
// ============================================================================

export const getGestureDescription = (gesture: string): string => {
  const descriptions: Record<string, string> = {
    tap: 'Single tap',
    doubleTap: 'Double tap',
    longPress: 'Press and hold',
    pan: 'Drag with one finger',
    pinch: 'Pinch with two fingers',
    rotate: 'Rotate with two fingers',
    swipe: 'Swipe',
  };

  return descriptions[gesture] || gesture;
};
