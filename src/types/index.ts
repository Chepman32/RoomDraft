/**
 * Core Type Definitions for RoomDraft
 */

// ============================================================================
// Database Models
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description?: string;
  thumbnailUri?: string;
  createdAt: string;
  updatedAt: string;
  isPro: boolean;
}

export interface Plan {
  id: string;
  projectId: string;
  title: string;
  scale: number; // meters per pixel
  width: number; // canvas width in pixels
  height: number; // canvas height in pixels
  captureMethod: 'ar' | 'manual' | 'lidar';
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  planId: string;
  name: string;
  area: number; // square meters
  perimeter: number; // meters
  walls: Wall[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wall {
  id: string;
  roomId: string;
  start: Point;
  end: Point;
  thickness: number; // meters
  height: number; // meters
  type: 'exterior' | 'interior' | 'structural';
}

export interface PlacedObject {
  id: string;
  planId: string;
  roomId?: string;
  type: 'furniture' | 'fixture' | 'door' | 'window' | 'custom';
  templateId?: string; // Reference to furniture library
  position: Point;
  rotation: number; // degrees
  dimensions: Dimensions3D;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Export {
  id: string;
  projectId: string;
  planId: string;
  format: 'pdf' | 'svg' | 'dxf' | 'png';
  fileUri: string;
  fileSize: number;
  createdAt: string;
}

// ============================================================================
// Geometry Types
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Point3D extends Point {
  z: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Dimensions3D extends Dimensions {
  depth: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  translate: Point;
  scale: number;
  rotate: number;
}

// ============================================================================
// AR/LiDAR Types
// ============================================================================

export interface ARCaptureData {
  points: Point3D[];
  confidence: number;
  timestamp: number;
  devicePose: DevicePose;
}

export interface DevicePose {
  position: Point3D;
  rotation: Quaternion;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface LiDARFrame {
  depthMap: Float32Array;
  confidenceMap: Uint8Array;
  width: number;
  height: number;
  timestamp: number;
}

// ============================================================================
// Editor State Types
// ============================================================================

export type EditorMode =
  | 'select'
  | 'pan'
  | 'drawWall'
  | 'drawRoom'
  | 'placeObject'
  | 'measure'
  | 'delete';

export interface EditorState {
  mode: EditorMode;
  selectedObjectIds: string[];
  selectedRoomIds: string[];
  selectedWallIds: string[];
  clipboard: ClipboardData | null;
  history: HistoryEntry[];
  historyIndex: number;
  gridSnap: boolean;
  gridSize: number; // meters
  showGrid: boolean;
  showMeasurements: boolean;
  showLabels: boolean;
}

export interface ClipboardData {
  type: 'object' | 'room' | 'wall';
  data: PlacedObject | Room | Wall;
}

export interface HistoryEntry {
  type: 'add' | 'update' | 'delete';
  entityType: 'object' | 'room' | 'wall';
  before: any;
  after: any;
  timestamp: number;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'length'
  | 'angle'
  | 'opacity'
  | 'enum'
  | 'icon'
  | 'imageUri';

export type GestureType =
  | 'tap'
  | 'doubleTap'
  | 'longPress'
  | 'pressAndHold'
  | 'pan'
  | 'drag'
  | 'pinch'
  | 'scroll'
  | 'fling'
  | 'edgeSwipe'
  | 'hover';

export interface ComponentProp {
  name: string;
  type: PropType;
  required: boolean;
  defaultValue?: any;
}

export interface AnimationHook {
  name: string;
  trigger: GestureType | 'mount' | 'unmount' | 'focus' | 'blur';
  config: AnimationConfig;
}

export interface AnimationConfig {
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
}

// ============================================================================
// Theme & Design System Types
// ============================================================================

export interface ColorToken {
  light: string;
  dark: string;
}

export interface ThemeColors {
  // Semantic colors
  background: ColorToken;
  surface: ColorToken;
  surfaceElevated: ColorToken;
  primary: ColorToken;
  secondary: ColorToken;
  tertiary: ColorToken;

  // Text colors
  textPrimary: ColorToken;
  textSecondary: ColorToken;
  textTertiary: ColorToken;
  textInverse: ColorToken;

  // State colors
  success: ColorToken;
  warning: ColorToken;
  error: ColorToken;
  info: ColorToken;

  // Border & divider
  border: ColorToken;
  divider: ColorToken;

  // Overlay
  overlay: ColorToken;
  scrim: ColorToken;
}

export interface Typography {
  largeTitle: TextStyle;
  title1: TextStyle;
  title2: TextStyle;
  title3: TextStyle;
  headline: TextStyle;
  body: TextStyle;
  bodyBold: TextStyle;
  callout: TextStyle;
  subheadline: TextStyle;
  footnote: TextStyle;
  caption1: TextStyle;
  caption2: TextStyle;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing: number;
}

export interface Spacing {
  xs: number; // 4
  sm: number; // 8
  md: number; // 16
  lg: number; // 24
  xl: number; // 32
  xxl: number; // 48
}

// ============================================================================
// IAP Types
// ============================================================================

export type PurchaseType = 'consumable' | 'non-consumable' | 'subscription';

export interface IAPProduct {
  id: string;
  type: PurchaseType;
  price: string;
  title: string;
  description: string;
  features: string[];
}

export interface Purchase {
  productId: string;
  transactionId: string;
  purchaseDate: string;
  expirationDate?: string; // For subscriptions
  isActive: boolean;
}

// ============================================================================
// Navigation Types
// ============================================================================

export type RootStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: {projectId: string};
  ARCapture: {planId: string};
  Editor: {planId: string};
  Export: {planId: string};
  Settings: undefined;
};

export type TabParamList = {
  Projects: undefined;
  Capture: undefined;
  Settings: undefined;
};

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
