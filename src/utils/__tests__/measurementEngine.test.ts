import {
  AreaCalculator,
  MaterialCalculator,
  CostEstimator,
} from '../measurementEngine';
import type { Room, Wall } from '@/types';

describe('Measurement Engine', () => {
  describe('AreaCalculator', () => {
    it('should calculate room area from walls', () => {
      const walls: Partial<Wall>[] = [
        { startX: 0, startY: 0, endX: 10, endY: 0 },
        { startX: 10, startY: 0, endX: 10, endY: 10 },
        { startX: 10, startY: 10, endX: 0, endY: 10 },
        { startX: 0, startY: 10, endX: 0, endY: 0 },
      ];

      const area = AreaCalculator.calculateRoomArea(walls as Wall[]);
      expect(area).toBeCloseTo(100, 1);
    });

    it('should calculate total usable area', () => {
      const rooms: Partial<Room>[] = [
        { area: 25, type: 'living' },
        { area: 15, type: 'bedroom' },
        { area: 10, type: 'bathroom' },
      ];

      const totalArea = AreaCalculator.calculateUsableArea(rooms as Room[]);
      expect(totalArea).toBe(50);
    });

    it('should calculate perimeter', () => {
      const walls: Partial<Wall>[] = [
        { startX: 0, startY: 0, endX: 10, endY: 0 },
        { startX: 10, startY: 0, endX: 10, endY: 10 },
        { startX: 10, startY: 10, endX: 0, endY: 10 },
        { startX: 0, startY: 10, endX: 0, endY: 0 },
      ];

      const perimeter = AreaCalculator.calculatePerimeter(walls as Wall[]);
      expect(perimeter).toBe(40);
    });
  });

  describe('MaterialCalculator', () => {
    it('should calculate flooring material with waste factor', () => {
      const rooms: Partial<Room>[] = [
        { area: 25 },
        { area: 15 },
      ];

      const material = MaterialCalculator.calculateFlooringMaterial(
        rooms as Room[],
        0.1 // 10% waste
      );

      expect(material.area).toBe(40);
      expect(material.totalWithWaste).toBe(44);
      expect(material.wasteFactor).toBe(0.1);
    });

    it('should calculate paint requirement', () => {
      const rooms: Partial<Room>[] = [
        { area: 25, perimeter: 20 },
      ];

      const paint = MaterialCalculator.calculatePaintRequirement(
        rooms as Room[],
        2, // 2 coats
        2.5 // wall height
      );

      expect(paint.wallArea).toBe(50); // 20 * 2.5
      expect(paint.coats).toBe(2);
      expect(paint.totalAreaToPaint).toBe(100); // 50 * 2
    });

    it('should calculate drywall requirement', () => {
      const totalWallArea = 100;
      const wasteFactor = 0.15;

      const drywall = MaterialCalculator.calculateDrywallRequirement(
        totalWallArea,
        wasteFactor
      );

      expect(drywall.sheets).toBeGreaterThan(0);
      expect(drywall.totalAreaWithWaste).toBe(115);
    });
  });

  describe('CostEstimator', () => {
    it('should generate full cost estimate', () => {
      const rooms: Partial<Room>[] = [
        { area: 25, perimeter: 20, type: 'living' },
      ];

      const estimate = CostEstimator.generateFullEstimate(
        rooms as Room[],
        { flooring: 50, paint: 30, drywall: 25 },
        { flooring: 10, paint: 5, drywall: 8 }
      );

      expect(estimate).toHaveProperty('materials');
      expect(estimate).toHaveProperty('labor');
      expect(estimate).toHaveProperty('total');
      expect(estimate.total).toBeGreaterThan(0);
    });

    it('should calculate flooring cost', () => {
      const area = 40;
      const costPerUnit = 50;

      const cost = CostEstimator.calculateFlooringCost(area, costPerUnit);
      expect(cost).toBe(2000);
    });

    it('should calculate paint cost', () => {
      const coverage = 100;
      const coats = 2;
      const costPerLiter = 30;
      const coveragePerLiter = 10;

      const cost = CostEstimator.calculatePaintCost(
        coverage,
        coats,
        costPerLiter,
        coveragePerLiter
      );

      expect(cost).toBe(600); // (100 * 2 / 10) * 30
    });
  });
});
