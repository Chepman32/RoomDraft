/**
 * Geometry Utilities Tests
 */

import {
  distance,
  midpoint,
  add,
  subtract,
  scale,
  rotate,
  snapToGrid,
  polygonArea,
  polygonPerimeter,
  angleBetweenPoints,
} from '../geometry';
import type {Point} from '@types/index';

describe('Geometry Utilities', () => {
  describe('distance', () => {
    it('should calculate distance between two points', () => {
      const p1: Point = {x: 0, y: 0};
      const p2: Point = {x: 3, y: 4};
      expect(distance(p1, p2)).toBe(5);
    });

    it('should return 0 for same point', () => {
      const p: Point = {x: 1, y: 1};
      expect(distance(p, p)).toBe(0);
    });
  });

  describe('midpoint', () => {
    it('should calculate midpoint between two points', () => {
      const p1: Point = {x: 0, y: 0};
      const p2: Point = {x: 4, y: 6};
      const mid = midpoint(p1, p2);
      expect(mid).toEqual({x: 2, y: 3});
    });
  });

  describe('add', () => {
    it('should add two points', () => {
      const p1: Point = {x: 1, y: 2};
      const p2: Point = {x: 3, y: 4};
      const result = add(p1, p2);
      expect(result).toEqual({x: 4, y: 6});
    });
  });

  describe('subtract', () => {
    it('should subtract two points', () => {
      const p1: Point = {x: 5, y: 7};
      const p2: Point = {x: 2, y: 3};
      const result = subtract(p1, p2);
      expect(result).toEqual({x: 3, y: 4});
    });
  });

  describe('scale', () => {
    it('should scale a point by factor', () => {
      const p: Point = {x: 2, y: 3};
      const result = scale(p, 2);
      expect(result).toEqual({x: 4, y: 6});
    });
  });

  describe('snapToGrid', () => {
    it('should snap point to grid', () => {
      const p: Point = {x: 23, y: 47};
      const result = snapToGrid(p, 10);
      expect(result).toEqual({x: 20, y: 50});
    });
  });

  describe('polygonArea', () => {
    it('should calculate area of square', () => {
      const square: Point[] = [
        {x: 0, y: 0},
        {x: 10, y: 0},
        {x: 10, y: 10},
        {x: 0, y: 10},
      ];
      expect(polygonArea(square)).toBe(100);
    });

    it('should return 0 for less than 3 points', () => {
      expect(polygonArea([{x: 0, y: 0}])).toBe(0);
    });
  });

  describe('polygonPerimeter', () => {
    it('should calculate perimeter of square', () => {
      const square: Point[] = [
        {x: 0, y: 0},
        {x: 10, y: 0},
        {x: 10, y: 10},
        {x: 0, y: 10},
      ];
      expect(polygonPerimeter(square)).toBe(40);
    });
  });

  describe('angleBetweenPoints', () => {
    it('should calculate angle between points', () => {
      const p1: Point = {x: 0, y: 0};
      const p2: Point = {x: 1, y: 0};
      expect(angleBetweenPoints(p1, p2)).toBe(0);
    });

    it('should calculate 90 degree angle', () => {
      const p1: Point = {x: 0, y: 0};
      const p2: Point = {x: 0, y: 1};
      expect(angleBetweenPoints(p1, p2)).toBe(90);
    });
  });
});
