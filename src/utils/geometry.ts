/**
 * Geometry Utilities
 */

import {Point, Point3D, Dimensions, Rect} from '@types/index';

// ============================================================================
// 2D Point Operations
// ============================================================================

export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const distance3D = (p1: Point3D, p2: Point3D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const midpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

export const add = (p1: Point, p2: Point): Point => {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
};

export const subtract = (p1: Point, p2: Point): Point => {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
};

export const scale = (p: Point, factor: number): Point => {
  return {
    x: p.x * factor,
    y: p.y * factor,
  };
};

export const rotate = (p: Point, origin: Point, angleDegrees: number): Point => {
  const angleRad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const dx = p.x - origin.x;
  const dy = p.y - origin.y;

  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
};

// ============================================================================
// Snapping
// ============================================================================

export const snapToGrid = (p: Point, gridSize: number): Point => {
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize,
  };
};

export const snapToPoint = (p: Point, target: Point, threshold: number): Point => {
  const dist = distance(p, target);
  return dist < threshold ? target : p;
};

// ============================================================================
// Rectangle Operations
// ============================================================================

export const containsPoint = (rect: Rect, point: Point): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

export const intersects = (rect1: Rect, rect2: Rect): boolean => {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
};

// ============================================================================
// Area & Perimeter
// ============================================================================

export const polygonArea = (points: Point[]): number => {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area / 2);
};

export const polygonPerimeter = (points: Point[]): number => {
  if (points.length < 2) {
    return 0;
  }

  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    perimeter += distance(points[i], points[j]);
  }

  return perimeter;
};

// ============================================================================
// Angle Calculations
// ============================================================================

export const angleBetweenPoints = (p1: Point, p2: Point): number => {
  const rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  return (rad * 180) / Math.PI;
};

export const normalizeAngle = (angle: number): number => {
  while (angle < 0) {
    angle += 360;
  }
  while (angle >= 360) {
    angle -= 360;
  }
  return angle;
};
