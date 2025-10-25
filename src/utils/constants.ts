/**
 * App Configuration and Constants
 */

export const APP_CONFIG = {
  name: 'RoomDraft',
  version: '1.0.0',
  buildNumber: 1,

  // Features
  features: {
    arCapture: true,
    lidarCapture: true,
    manualDrawing: true,
    export: {
      pdf: true,
      svg: true,
      png: true,
      dxf: true, // Pro only
    },
    iap: true,
    notifications: true,
  },

  // Limits
  limits: {
    free: {
      maxProjects: 100,
      maxPlansPerProject: 3,
      maxRoomsPerPlan: 10,
      maxObjectsPerPlan: 50,
    },
    pro: {
      maxProjects: Infinity,
      maxPlansPerProject: Infinity,
      maxRoomsPerPlan: Infinity,
      maxObjectsPerPlan: Infinity,
    },
  },

  // IAP Products
  iap: {
    products: {
      proUnlock: 'pro_unlock',
    },
    prices: {
      proUnlock: '$9.99',
    },
  },

  // Database
  database: {
    name: 'roomdraft.db',
    version: 1,
  },

  // File System
  fileSystem: {
    exportsDirectory: 'exports',
    thumbnailsDirectory: 'thumbnails',
    tempDirectory: 'temp',
  },

  // Measurements
  measurements: {
    defaultUnit: 'meters',
    defaultScale: 0.01, // meters per pixel
    gridSizes: [0.1, 0.25, 0.5, 1.0, 2.0], // meters
    minWallLength: 0.1, // meters
    minWallThickness: 0.1, // meters
    maxWallThickness: 1.0, // meters
    defaultWallHeight: 2.5, // meters
  },

  // Editor
  editor: {
    canvasSize: {
      width: 2000,
      height: 2000,
    },
    snapThreshold: 10, // pixels
    selectionRadius: 20, // pixels
    minZoom: 0.1,
    maxZoom: 5.0,
    defaultZoom: 1.0,
  },

  // Capture
  capture: {
    ar: {
      minConfidence: 0.7,
      pointCloudDensity: 'medium',
    },
    lidar: {
      maxDistance: 5.0, // meters
      minPoints: 100,
    },
  },

  // Animation
  animation: {
    defaultDuration: 300,
    fastDuration: 150,
    slowDuration: 500,
    springConfig: {
      stiffness: 240,
      damping: 18,
    },
  },

  // URLs
  urls: {
    website: 'https://roomdraft.app',
    support: 'https://roomdraft.app/support',
    privacy: 'https://roomdraft.app/privacy',
    terms: 'https://roomdraft.app/terms',
  },
};

// ============================================================================
// Color Constants
// ============================================================================

export const COLORS = {
  // Wall colors
  walls: {
    exterior: '#424242',
    interior: '#757575',
    structural: '#212121',
  },

  // Room colors (default palette)
  rooms: [
    '#2196F3',
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
    '#F44336',
    '#00BCD4',
    '#FFEB3B',
    '#795548',
  ],

  // Object types
  objects: {
    furniture: '#8D6E63',
    fixture: '#607D8B',
    door: '#3F51B5',
    window: '#03A9F4',
    custom: '#9E9E9E',
  },
};

// ============================================================================
// Icon Constants
// ============================================================================

export const ICONS = {
  modes: {
    select: 'cursor',
    pan: 'hand',
    drawWall: 'pencil',
    drawRoom: 'square',
    placeObject: 'cube',
    measure: 'ruler',
    delete: 'trash',
  },

  tools: {
    undo: 'arrow-left',
    redo: 'arrow-right',
    copy: 'copy',
    paste: 'clipboard',
    duplicate: 'duplicate',
    grid: 'grid',
    snap: 'magnet',
    layers: 'layers',
  },

  objects: {
    furniture: 'chair',
    door: 'door',
    window: 'window',
    fixture: 'lightbulb',
  },
};

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  // Database
  database: {
    initFailed: 'Failed to initialize database',
    operationFailed: 'Database operation failed',
    notFound: 'Record not found',
  },

  // Projects
  projects: {
    loadFailed: 'Failed to load projects',
    createFailed: 'Failed to create project',
    updateFailed: 'Failed to update project',
    deleteFailed: 'Failed to delete project',
    limitReached: 'Project limit reached. Upgrade to Pro for unlimited projects.',
  },

  // Plans
  plans: {
    loadFailed: 'Failed to load plans',
    createFailed: 'Failed to create plan',
    limitReached: 'Plan limit reached. Upgrade to Pro for unlimited plans.',
  },

  // Capture
  capture: {
    arNotAvailable: 'AR is not available on this device',
    lidarNotAvailable: 'LiDAR is not available on this device',
    permissionDenied: 'Camera permission denied',
    captureFailed: 'Failed to capture floor plan',
    lowConfidence: 'Capture confidence too low. Please try again.',
  },

  // Export
  export: {
    failed: 'Failed to export floor plan',
    formatNotSupported: 'Export format not supported',
    proRequired: 'This export format requires Pro',
    saveFailed: 'Failed to save export',
  },

  // IAP
  iap: {
    purchaseFailed: 'Purchase failed',
    restoreFailed: 'Failed to restore purchases',
    notAvailable: 'In-app purchases not available',
  },

  // General
  general: {
    networkError: 'Network error',
    unknownError: 'An unknown error occurred',
    timeout: 'Operation timed out',
  },
};

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  projects: {
    created: 'Project created successfully',
    updated: 'Project updated successfully',
    deleted: 'Project deleted successfully',
  },

  plans: {
    created: 'Plan created successfully',
    updated: 'Plan updated successfully',
    deleted: 'Plan deleted successfully',
  },

  export: {
    completed: 'Export completed successfully',
    saved: 'Export saved to files',
  },

  iap: {
    purchased: 'Purchase completed successfully',
    restored: 'Purchases restored successfully',
  },
};

// ============================================================================
// Keyboard Shortcuts (for future desktop support)
// ============================================================================

export const KEYBOARD_SHORTCUTS = {
  editor: {
    undo: 'Cmd+Z',
    redo: 'Cmd+Shift+Z',
    copy: 'Cmd+C',
    paste: 'Cmd+V',
    duplicate: 'Cmd+D',
    delete: 'Backspace',
    selectAll: 'Cmd+A',
    deselect: 'Escape',
    save: 'Cmd+S',
  },

  navigation: {
    home: 'Cmd+H',
    settings: 'Cmd+,',
    newProject: 'Cmd+N',
    search: 'Cmd+F',
  },
};

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION = {
  project: {
    titleMinLength: 1,
    titleMaxLength: 100,
    descriptionMaxLength: 500,
  },

  plan: {
    titleMinLength: 1,
    titleMaxLength: 100,
    minScale: 0.001,
    maxScale: 1.0,
    minDimension: 100,
    maxDimension: 10000,
  },

  room: {
    nameMinLength: 1,
    nameMaxLength: 50,
    minArea: 0.1,
    maxArea: 10000,
  },

  wall: {
    minLength: 0.1,
    maxLength: 100,
    minThickness: 0.05,
    maxThickness: 2.0,
    minHeight: 1.0,
    maxHeight: 10.0,
  },

  object: {
    minWidth: 0.1,
    maxWidth: 10.0,
    minHeight: 0.1,
    maxHeight: 10.0,
    minDepth: 0.1,
    maxDepth: 10.0,
  },
};
