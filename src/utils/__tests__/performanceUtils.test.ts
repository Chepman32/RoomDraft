import {
  SpatialIndex,
  DirtyRectTracker,
  ObjectPool,
} from '../performanceUtils';
import type { Rect } from '@/types';

describe('Performance Utils', () => {
  describe('SpatialIndex', () => {
    let index: SpatialIndex;

    beforeEach(() => {
      index = new SpatialIndex(10, 1000, 1000);
    });

    it('should add items to the index', () => {
      const bounds: Rect = { x: 0, y: 0, width: 50, height: 50 };
      index.addItem('item-1', bounds);

      const results = index.queryPoint({ x: 25, y: 25 }, 0);
      expect(results.has('item-1')).toBe(true);
    });

    it('should query items by point with radius', () => {
      index.addItem('item-1', { x: 0, y: 0, width: 10, height: 10 });
      index.addItem('item-2', { x: 100, y: 100, width: 10, height: 10 });

      const results = index.queryPoint({ x: 5, y: 5 }, 20);

      expect(results.has('item-1')).toBe(true);
      expect(results.has('item-2')).toBe(false);
    });

    it('should query items by rect', () => {
      index.addItem('item-1', { x: 0, y: 0, width: 10, height: 10 });
      index.addItem('item-2', { x: 50, y: 50, width: 10, height: 10 });

      const results = index.queryRect({ x: 0, y: 0, width: 30, height: 30 });

      expect(results.has('item-1')).toBe(true);
      expect(results.has('item-2')).toBe(false);
    });

    it('should remove items from index', () => {
      index.addItem('item-1', { x: 0, y: 0, width: 10, height: 10 });
      index.removeItem('item-1');

      const results = index.queryPoint({ x: 5, y: 5 }, 0);
      expect(results.has('item-1')).toBe(false);
    });

    it('should clear the index', () => {
      index.addItem('item-1', { x: 0, y: 0, width: 10, height: 10 });
      index.addItem('item-2', { x: 50, y: 50, width: 10, height: 10 });

      index.clear();

      const results = index.queryRect({ x: 0, y: 0, width: 1000, height: 1000 });
      expect(results.size).toBe(0);
    });
  });

  describe('DirtyRectTracker', () => {
    let tracker: DirtyRectTracker;

    beforeEach(() => {
      tracker = new DirtyRectTracker();
    });

    it('should mark rectangles as dirty', () => {
      tracker.markDirty({ x: 0, y: 0, width: 10, height: 10 });
      tracker.markDirty({ x: 20, y: 20, width: 10, height: 10 });

      const dirtyRects = tracker.getDirtyRects();
      expect(dirtyRects.length).toBe(2);
    });

    it('should merge overlapping dirty rectangles', () => {
      tracker.markDirty({ x: 0, y: 0, width: 10, height: 10 });
      tracker.markDirty({ x: 5, y: 5, width: 10, height: 10 });

      const dirtyRects = tracker.getDirtyRects();
      expect(dirtyRects.length).toBe(1);
      expect(dirtyRects[0].width).toBeGreaterThan(10);
    });

    it('should clear dirty rectangles', () => {
      tracker.markDirty({ x: 0, y: 0, width: 10, height: 10 });
      tracker.clear();

      const dirtyRects = tracker.getDirtyRects();
      expect(dirtyRects.length).toBe(0);
    });

    it('should check if any rectangles are dirty', () => {
      expect(tracker.isDirty()).toBe(false);

      tracker.markDirty({ x: 0, y: 0, width: 10, height: 10 });
      expect(tracker.isDirty()).toBe(true);

      tracker.clear();
      expect(tracker.isDirty()).toBe(false);
    });
  });

  describe('ObjectPool', () => {
    let pool: ObjectPool<{ value: number }>;

    beforeEach(() => {
      pool = new ObjectPool(
        () => ({ value: 0 }),
        (obj) => {
          obj.value = 0;
        }
      );
    });

    it('should acquire objects from pool', () => {
      const obj1 = pool.acquire();
      const obj2 = pool.acquire();

      expect(obj1).toBeDefined();
      expect(obj2).toBeDefined();
      expect(obj1).not.toBe(obj2);
    });

    it('should release objects back to pool', () => {
      const obj = pool.acquire();
      obj.value = 42;

      pool.release(obj);

      const reusedObj = pool.acquire();
      expect(reusedObj.value).toBe(0); // Should be reset
    });

    it('should reuse released objects', () => {
      const obj1 = pool.acquire();
      pool.release(obj1);

      const obj2 = pool.acquire();
      expect(obj1).toBe(obj2); // Should be the same object
    });

    it('should clear the pool', () => {
      const obj1 = pool.acquire();
      const obj2 = pool.acquire();

      pool.release(obj1);
      pool.release(obj2);

      pool.clear();

      const obj3 = pool.acquire();
      expect(obj3).not.toBe(obj1);
      expect(obj3).not.toBe(obj2);
    });

    it('should track pool size', () => {
      expect(pool.size()).toBe(0);

      const obj1 = pool.acquire();
      pool.release(obj1);

      expect(pool.size()).toBe(1);

      const obj2 = pool.acquire();
      pool.release(obj2);

      expect(pool.size()).toBe(2);
    });
  });
});
