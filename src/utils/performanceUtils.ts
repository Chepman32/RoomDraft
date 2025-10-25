/**
 * Performance Optimization Utilities
 */

import {Point, Rect} from '@types/index';

// ============================================================================
// Debounce & Throttle
// ============================================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// Memoization
// ============================================================================

export function memoize<T extends (...args: any[]) => any>(
  func: T,
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// ============================================================================
// Spatial Indexing (for fast hit testing)
// ============================================================================

export class SpatialIndex {
  private grid: Map<string, Set<string>> = new Map();
  private cellSize: number;

  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
  }

  // Get grid cell key for point
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  // Add item to spatial index
  addItem(id: string, bounds: Rect): void {
    const minCellX = Math.floor(bounds.x / this.cellSize);
    const minCellY = Math.floor(bounds.y / this.cellSize);
    const maxCellX = Math.floor((bounds.x + bounds.width) / this.cellSize);
    const maxCellY = Math.floor((bounds.y + bounds.height) / this.cellSize);

    for (let x = minCellX; x <= maxCellX; x++) {
      for (let y = minCellY; y <= maxCellY; y++) {
        const key = `${x},${y}`;
        if (!this.grid.has(key)) {
          this.grid.set(key, new Set());
        }
        this.grid.get(key)!.add(id);
      }
    }
  }

  // Remove item from spatial index
  removeItem(id: string, bounds: Rect): void {
    const minCellX = Math.floor(bounds.x / this.cellSize);
    const minCellY = Math.floor(bounds.y / this.cellSize);
    const maxCellX = Math.floor((bounds.x + bounds.width) / this.cellSize);
    const maxCellY = Math.floor((bounds.y + bounds.height) / this.cellSize);

    for (let x = minCellX; x <= maxCellX; x++) {
      for (let y = minCellY; y <= maxCellY; y++) {
        const key = `${x},${y}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.delete(id);
          if (cell.size === 0) {
            this.grid.delete(key);
          }
        }
      }
    }
  }

  // Query items near point
  queryPoint(point: Point, radius: number = 0): Set<string> {
    const result = new Set<string>();

    const minX = point.x - radius;
    const minY = point.y - radius;
    const maxX = point.x + radius;
    const maxY = point.y + radius;

    const minCellX = Math.floor(minX / this.cellSize);
    const minCellY = Math.floor(minY / this.cellSize);
    const maxCellX = Math.floor(maxX / this.cellSize);
    const maxCellY = Math.floor(maxY / this.cellSize);

    for (let x = minCellX; x <= maxCellX; x++) {
      for (let y = minCellY; y <= maxCellY; y++) {
        const key = `${x},${y}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.forEach(id => result.add(id));
        }
      }
    }

    return result;
  }

  // Query items in rectangle
  queryRect(bounds: Rect): Set<string> {
    const result = new Set<string>();

    const minCellX = Math.floor(bounds.x / this.cellSize);
    const minCellY = Math.floor(bounds.y / this.cellSize);
    const maxCellX = Math.floor((bounds.x + bounds.width) / this.cellSize);
    const maxCellY = Math.floor((bounds.y + bounds.height) / this.cellSize);

    for (let x = minCellX; x <= maxCellX; x++) {
      for (let y = minCellY; y <= maxCellY; y++) {
        const key = `${x},${y}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.forEach(id => result.add(id));
        }
      }
    }

    return result;
  }

  // Clear index
  clear(): void {
    this.grid.clear();
  }
}

// ============================================================================
// Dirty Rectangle Tracking (for differential rendering)
// ============================================================================

export class DirtyRectTracker {
  private dirtyRects: Rect[] = [];
  private isDirtyAll: boolean = false;

  // Mark region as dirty
  markDirty(rect: Rect): void {
    if (this.isDirtyAll) return;

    this.dirtyRects.push(rect);

    // Merge overlapping rectangles
    this.mergeDirtyRects();
  }

  // Mark entire canvas as dirty
  markDirtyAll(): void {
    this.isDirtyAll = true;
    this.dirtyRects = [];
  }

  // Check if point is in dirty region
  isPointDirty(point: Point): boolean {
    if (this.isDirtyAll) return true;

    return this.dirtyRects.some(
      rect =>
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height,
    );
  }

  // Get all dirty rectangles
  getDirtyRects(): Rect[] {
    return [...this.dirtyRects];
  }

  // Check if all is dirty
  isDirtyAllFlag(): boolean {
    return this.isDirtyAll;
  }

  // Clear dirty state
  clear(): void {
    this.dirtyRects = [];
    this.isDirtyAll = false;
  }

  // Merge overlapping rectangles
  private mergeDirtyRects(): void {
    if (this.dirtyRects.length < 2) return;

    const merged: Rect[] = [];
    const sorted = [...this.dirtyRects].sort((a, b) => a.x - b.x);

    let current = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];

      if (this.rectsOverlap(current, next)) {
        current = this.mergeRects(current, next);
      } else {
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
    this.dirtyRects = merged;
  }

  // Check if rectangles overlap
  private rectsOverlap(a: Rect, b: Rect): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  // Merge two rectangles
  private mergeRects(a: Rect, b: Rect): Rect {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x + a.width, b.x + b.width);
    const maxY = Math.max(a.y + a.height, b.y + b.height);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}

// ============================================================================
// Object Pool (for reusable objects)
// ============================================================================

export class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private factory: () => T;
  private reset?: (obj: T) => void;

  constructor(factory: () => T, initialSize: number = 10, reset?: (obj: T) => void) {
    this.factory = factory;
    this.reset = reset;

    // Create initial objects
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  // Acquire object from pool
  acquire(): T {
    let obj: T;

    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      obj = this.factory();
    }

    this.inUse.add(obj);
    return obj;
  }

  // Release object back to pool
  release(obj: T): void {
    if (!this.inUse.has(obj)) return;

    this.inUse.delete(obj);

    if (this.reset) {
      this.reset(obj);
    }

    this.available.push(obj);
  }

  // Release all objects
  releaseAll(): void {
    this.inUse.forEach(obj => {
      if (this.reset) {
        this.reset(obj);
      }
      this.available.push(obj);
    });
    this.inUse.clear();
  }

  // Get pool stats
  getStats(): {available: number; inUse: number; total: number} {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    };
  }
}

// ============================================================================
// Performance Monitor
// ============================================================================

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private maxSamples: number = 100;

  // Start timing
  start(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(label, duration);
    };
  }

  // Record metric
  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const samples = this.metrics.get(label)!;
    samples.push(value);

    // Keep only recent samples
    if (samples.length > this.maxSamples) {
      samples.shift();
    }
  }

  // Get average metric
  getAverage(label: string): number | null {
    const samples = this.metrics.get(label);
    if (!samples || samples.length === 0) return null;

    const sum = samples.reduce((a, b) => a + b, 0);
    return sum / samples.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, {avg: number; min: number; max: number; count: number}> {
    const result: Record<string, any> = {};

    this.metrics.forEach((samples, label) => {
      if (samples.length > 0) {
        result[label] = {
          avg: samples.reduce((a, b) => a + b, 0) / samples.length,
          min: Math.min(...samples),
          max: Math.max(...samples),
          count: samples.length,
        };
      }
    });

    return result;
  }

  // Clear metrics
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
