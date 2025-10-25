/**
 * Measurement and Calculation Engine
 * Advanced calculations for floor plans
 */

import {Point, Point3D, Wall, Room} from '@types/index';
import {distance, polygonArea, polygonPerimeter} from './geometry';
import {APP_CONFIG} from './constants';

// ============================================================================
// Area Calculations
// ============================================================================

export class AreaCalculator {
  // Calculate room area from walls
  static calculateRoomArea(walls: Wall[]): number {
    const points: Point[] = walls.map(w => w.start);
    const areaPixels = polygonArea(points);
    const scale = APP_CONFIG.measurements.defaultScale;
    return areaPixels * Math.pow(scale, 2);
  }

  // Calculate total area of multiple rooms
  static calculateTotalArea(rooms: Room[]): number {
    return rooms.reduce((total, room) => total + room.area, 0);
  }

  // Calculate usable area (excluding walls)
  static calculateUsableArea(rooms: Room[]): number {
    let totalArea = this.calculateTotalArea(rooms);
    let wallArea = 0;

    for (const room of rooms) {
      const walls = JSON.parse(room.walls as any) || [];
      for (const wall of walls) {
        const wallLength = distance(wall.start, wall.end) * APP_CONFIG.measurements.defaultScale;
        const wallThickness = wall.thickness * APP_CONFIG.measurements.defaultScale;
        wallArea += wallLength * wallThickness;
      }
    }

    return Math.max(0, totalArea - wallArea);
  }

  // Calculate area of irregular polygon
  static calculateIrregularArea(points: Point3D[]): number {
    if (points.length < 3) return 0;

    // Project to 2D (use X and Z coordinates)
    const points2D: Point[] = points.map(p => ({x: p.x, y: p.z}));
    return polygonArea(points2D);
  }
}

// ============================================================================
// Distance Calculations
// ============================================================================

export class DistanceCalculator {
  // Calculate perimeter from walls
  static calculatePerimeter(walls: Wall[]): number {
    let totalDistance = 0;

    for (const wall of walls) {
      const dist = distance(wall.start, wall.end);
      totalDistance += dist * APP_CONFIG.measurements.defaultScale;
    }

    return totalDistance;
  }

  // Calculate shortest distance between two points
  static shortestDistance(p1: Point, p2: Point): number {
    return distance(p1, p2) * APP_CONFIG.measurements.defaultScale;
  }

  // Calculate distance along path
  static pathDistance(points: Point[]): number {
    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += distance(points[i], points[i + 1]);
    }

    return totalDistance * APP_CONFIG.measurements.defaultScale;
  }

  // Calculate 3D distance
  static distance3D(p1: Point3D, p2: Point3D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

// ============================================================================
// Volume Calculations
// ============================================================================

export class VolumeCalculator {
  // Calculate room volume
  static calculateRoomVolume(room: Room, ceilingHeight?: number): number {
    const height = ceilingHeight || APP_CONFIG.measurements.defaultWallHeight;
    return room.area * height;
  }

  // Calculate total volume of multiple rooms
  static calculateTotalVolume(rooms: Room[], ceilingHeight?: number): number {
    return rooms.reduce(
      (total, room) => total + this.calculateRoomVolume(room, ceilingHeight),
      0,
    );
  }

  // Calculate cubic meters for air conditioning sizing
  static calculateACRequirement(rooms: Room[]): {
    cubicMeters: number;
    recommendedBTU: number;
  } {
    const cubicMeters = this.calculateTotalVolume(rooms);
    // Rough estimate: 25-30 BTU per cubic meter
    const recommendedBTU = Math.ceil(cubicMeters * 27.5);

    return {cubicMeters, recommendedBTU};
  }
}

// ============================================================================
// Material Calculations
// ============================================================================

export class MaterialCalculator {
  // Calculate flooring required
  static calculateFlooringMaterial(rooms: Room[], wasteFactor: number = 1.1): {
    area: number;
    areaWithWaste: number;
    squareFeet: number;
  } {
    const area = AreaCalculator.calculateUsableArea(rooms);
    const areaWithWaste = area * wasteFactor;
    const squareFeet = areaWithWaste * 10.764; // Convert m² to ft²

    return {
      area,
      areaWithWaste,
      squareFeet,
    };
  }

  // Calculate paint required
  static calculatePaintRequirement(rooms: Room[], coats: number = 2): {
    wallArea: number;
    litersRequired: number;
    gallonsRequired: number;
  } {
    let totalWallArea = 0;

    for (const room of rooms) {
      const perimeter = room.perimeter;
      const height = APP_CONFIG.measurements.defaultWallHeight;
      const wallArea = perimeter * height;
      totalWallArea += wallArea;
    }

    // Typical coverage: 1 liter per 10 m²
    const litersRequired = Math.ceil((totalWallArea * coats) / 10);
    const gallonsRequired = Math.ceil(litersRequired * 0.264172); // Convert to gallons

    return {
      wallArea: totalWallArea,
      litersRequired,
      gallonsRequired,
    };
  }

  // Calculate baseboards/molding required
  static calculateBaseboardLength(rooms: Room[], wasteFactor: number = 1.1): {
    length: number;
    lengthWithWaste: number;
  } {
    let totalLength = 0;

    for (const room of rooms) {
      // Subtract door widths (simplified - use actual door count * 0.9m)
      totalLength += room.perimeter;
    }

    return {
      length: totalLength,
      lengthWithWaste: totalLength * wasteFactor,
    };
  }
}

// ============================================================================
// Cost Estimation
// ============================================================================

export interface CostEstimate {
  flooring: {material: string; costPerUnit: number; totalCost: number};
  paint: {coats: number; costPerLiter: number; totalCost: number};
  baseboards: {lengthMeters: number; costPerMeter: number; totalCost: number};
  labor: {hours: number; costPerHour: number; totalCost: number};
  total: number;
}

export class CostEstimator {
  // Estimate flooring cost
  static estimateFlooringCost(
    rooms: Room[],
    materialCostPerM2: number,
    laborCostPerM2: number,
  ): number {
    const {areaWithWaste} = MaterialCalculator.calculateFlooringMaterial(rooms);
    const materialCost = areaWithWaste * materialCostPerM2;
    const laborCost = areaWithWaste * laborCostPerM2;
    return materialCost + laborCost;
  }

  // Estimate painting cost
  static estimatePaintingCost(
    rooms: Room[],
    paintCostPerLiter: number,
    laborCostPerM2: number,
  ): number {
    const {wallArea, litersRequired} = MaterialCalculator.calculatePaintRequirement(rooms);
    const materialCost = litersRequired * paintCostPerLiter;
    const laborCost = wallArea * laborCostPerM2;
    return materialCost + laborCost;
  }

  // Generate full cost estimate
  static generateFullEstimate(
    rooms: Room[],
    flooringCostPerM2: number,
    paintCostPerLiter: number,
    baseboardCostPerMeter: number,
    laborCostPerHour: number,
  ): CostEstimate {
    const flooring = MaterialCalculator.calculateFlooringMaterial(rooms);
    const paint = MaterialCalculator.calculatePaintRequirement(rooms);
    const baseboard = MaterialCalculator.calculateBaseboardLength(rooms);

    // Estimate labor hours (simplified)
    const flooringHours = flooring.areaWithWaste * 0.5; // 30 min per m²
    const paintingHours = paint.wallArea * 0.3; // 18 min per m²
    const baseboardHours = baseboard.lengthWithWaste * 0.2; // 12 min per meter
    const totalHours = flooringHours + paintingHours + baseboardHours;

    const estimate: CostEstimate = {
      flooring: {
        material: 'laminate',
        costPerUnit: flooringCostPerM2,
        totalCost: flooring.areaWithWaste * flooringCostPerM2,
      },
      paint: {
        coats: 2,
        costPerLiter: paintCostPerLiter,
        totalCost: paint.litersRequired * paintCostPerLiter,
      },
      baseboards: {
        lengthMeters: baseboard.lengthWithWaste,
        costPerMeter: baseboardCostPerMeter,
        totalCost: baseboard.lengthWithWaste * baseboardCostPerMeter,
      },
      labor: {
        hours: Math.ceil(totalHours),
        costPerHour: laborCostPerHour,
        totalCost: Math.ceil(totalHours) * laborCostPerHour,
      },
      total: 0,
    };

    estimate.total =
      estimate.flooring.totalCost +
      estimate.paint.totalCost +
      estimate.baseboards.totalCost +
      estimate.labor.totalCost;

    return estimate;
  }
}

// ============================================================================
// Statistical Analysis
// ============================================================================

export interface PlanStatistics {
  totalArea: number;
  usableArea: number;
  totalPerimeter: number;
  totalVolume: number;
  roomCount: number;
  averageRoomSize: number;
  largestRoom: {name: string; area: number};
  smallestRoom: {name: string; area: number};
  wallLength: number;
  efficiency: number; // usable area / total area
}

export class StatisticsCalculator {
  static analyzePlan(rooms: Room[]): PlanStatistics {
    if (rooms.length === 0) {
      return {
        totalArea: 0,
        usableArea: 0,
        totalPerimeter: 0,
        totalVolume: 0,
        roomCount: 0,
        averageRoomSize: 0,
        largestRoom: {name: 'N/A', area: 0},
        smallestRoom: {name: 'N/A', area: 0},
        wallLength: 0,
        efficiency: 0,
      };
    }

    const totalArea = AreaCalculator.calculateTotalArea(rooms);
    const usableArea = AreaCalculator.calculateUsableArea(rooms);
    const totalVolume = VolumeCalculator.calculateTotalVolume(rooms);

    let totalPerimeter = 0;
    let wallLength = 0;

    for (const room of rooms) {
      totalPerimeter += room.perimeter;
      const walls = JSON.parse(room.walls as any) || [];
      wallLength += DistanceCalculator.calculatePerimeter(walls);
    }

    const sortedRooms = [...rooms].sort((a, b) => b.area - a.area);

    return {
      totalArea,
      usableArea,
      totalPerimeter,
      totalVolume,
      roomCount: rooms.length,
      averageRoomSize: totalArea / rooms.length,
      largestRoom: {
        name: sortedRooms[0].name,
        area: sortedRooms[0].area,
      },
      smallestRoom: {
        name: sortedRooms[sortedRooms.length - 1].name,
        area: sortedRooms[sortedRooms.length - 1].area,
      },
      wallLength,
      efficiency: totalArea > 0 ? usableArea / totalArea : 0,
    };
  }
}
