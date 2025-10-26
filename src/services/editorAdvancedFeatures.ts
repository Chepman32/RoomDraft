/**
 * Advanced Editor Features
 * - Grid snapping
 * - Smart guides and alignment
 * - Geometric constraints
 * - Auto-dimensioning
 */

import { Point, Wall, PlacedObject } from '@/types';
import { calculateDistance, calculateAngle, rotatePoint } from '@/utils/geometry';

// MARK: - Grid Snapping

export interface SnapResult {
  snapped: Point;
  snapType: 'grid' | 'point' | 'midpoint' | 'perpendicular' | 'tangent' | 'none';
  snapTarget?: any;
}

export class GridSnapping {
  private gridSize: number;
  private snapDistance: number;
  private enableAngularSnap: boolean;
  private angularSnapDegrees: number;

  constructor(
    gridSize: number = 0.5,
    snapDistance: number = 0.1,
    enableAngularSnap: boolean = true,
    angularSnapDegrees: number = 15
  ) {
    this.gridSize = gridSize;
    this.snapDistance = snapDistance;
    this.enableAngularSnap = enableAngularSnap;
    this.angularSnapDegrees = angularSnapDegrees;
  }

  snapToGrid(point: Point): SnapResult {
    const snappedX = Math.round(point.x / this.gridSize) * this.gridSize;
    const snappedY = Math.round(point.y / this.gridSize) * this.gridSize;

    const distance = calculateDistance(point, { x: snappedX, y: snappedY });

    if (distance <= this.snapDistance) {
      return {
        snapped: { x: snappedX, y: snappedY },
        snapType: 'grid',
      };
    }

    return {
      snapped: point,
      snapType: 'none',
    };
  }

  snapToPoint(point: Point, targets: Point[]): SnapResult {
    let closestPoint = point;
    let minDistance = this.snapDistance;
    let found = false;

    for (const target of targets) {
      const distance = calculateDistance(point, target);
      if (distance < minDistance) {
        closestPoint = target;
        minDistance = distance;
        found = true;
      }
    }

    return {
      snapped: closestPoint,
      snapType: found ? 'point' : 'none',
      snapTarget: found ? closestPoint : undefined,
    };
  }

  snapToMidpoint(point: Point, walls: Wall[]): SnapResult {
    let closestPoint = point;
    let minDistance = this.snapDistance;
    let found = false;

    for (const wall of walls) {
      const midpoint = {
        x: (wall.startX + wall.endX) / 2,
        y: (wall.startY + wall.endY) / 2,
      };

      const distance = calculateDistance(point, midpoint);
      if (distance < minDistance) {
        closestPoint = midpoint;
        minDistance = distance;
        found = true;
      }
    }

    return {
      snapped: closestPoint,
      snapType: found ? 'midpoint' : 'none',
    };
  }

  snapAngle(angle: number): number {
    if (!this.enableAngularSnap) {
      return angle;
    }

    const snapRadians = (this.angularSnapDegrees * Math.PI) / 180;
    return Math.round(angle / snapRadians) * snapRadians;
  }

  snapToAngularIncrement(point: Point, origin: Point): SnapResult {
    if (!this.enableAngularSnap) {
      return { snapped: point, snapType: 'none' };
    }

    const angle = calculateAngle(origin, point);
    const snappedAngle = this.snapAngle(angle);
    const distance = calculateDistance(origin, point);

    const snappedPoint = {
      x: origin.x + distance * Math.cos(snappedAngle),
      y: origin.y + distance * Math.sin(snappedAngle),
    };

    return {
      snapped: snappedPoint,
      snapType: 'perpendicular',
    };
  }

  setGridSize(size: number) {
    this.gridSize = size;
  }

  setSnapDistance(distance: number) {
    this.snapDistance = distance;
  }
}

// MARK: - Smart Guides

export interface Guide {
  id: string;
  type: 'horizontal' | 'vertical' | 'distance' | 'angle';
  position?: number;
  points?: Point[];
  value?: number;
  color?: string;
}

export class SmartGuides {
  private guides: Guide[] = [];
  private tolerance: number = 0.5;

  constructor(tolerance: number = 0.5) {
    this.tolerance = tolerance;
  }

  detectAlignmentGuides(
    movingObject: PlacedObject,
    staticObjects: PlacedObject[]
  ): Guide[] {
    const guides: Guide[] = [];

    for (const obj of staticObjects) {
      // Horizontal alignment
      if (Math.abs(movingObject.y - obj.y) < this.tolerance) {
        guides.push({
          id: `h-${obj.id}`,
          type: 'horizontal',
          position: obj.y,
          color: '#007AFF',
        });
      }

      // Vertical alignment
      if (Math.abs(movingObject.x - obj.x) < this.tolerance) {
        guides.push({
          id: `v-${obj.id}`,
          type: 'vertical',
          position: obj.x,
          color: '#007AFF',
        });
      }
    }

    return guides;
  }

  detectDistributionGuides(
    objects: PlacedObject[],
    direction: 'horizontal' | 'vertical'
  ): Guide[] {
    if (objects.length < 3) {
      return [];
    }

    const sorted = [...objects].sort((a, b) => {
      return direction === 'horizontal' ? a.x - b.x : a.y - b.y;
    });

    const guides: Guide[] = [];
    const distances: number[] = [];

    for (let i = 1; i < sorted.length; i++) {
      const dist =
        direction === 'horizontal'
          ? sorted[i].x - sorted[i - 1].x
          : sorted[i].y - sorted[i - 1].y;
      distances.push(dist);
    }

    // Check if equally distributed
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const isEquidistant = distances.every((d) => Math.abs(d - avgDistance) < this.tolerance);

    if (isEquidistant) {
      for (let i = 0; i < sorted.length - 1; i++) {
        const start = sorted[i];
        const end = sorted[i + 1];

        guides.push({
          id: `dist-${i}`,
          type: 'distance',
          points: [
            { x: start.x, y: start.y },
            { x: end.x, y: end.y },
          ],
          value: avgDistance,
          color: '#34C759',
        });
      }
    }

    return guides;
  }

  clearGuides() {
    this.guides = [];
  }

  getGuides(): Guide[] {
    return this.guides;
  }
}

// MARK: - Geometric Constraints

export interface Constraint {
  id: string;
  type: 'parallel' | 'perpendicular' | 'equal-length' | 'fixed-angle' | 'fixed-distance';
  entities: string[];
  value?: number;
}

export class GeometricConstraints {
  private constraints: Constraint[] = [];

  addParallelConstraint(wall1Id: string, wall2Id: string): Constraint {
    const constraint: Constraint = {
      id: `parallel-${wall1Id}-${wall2Id}`,
      type: 'parallel',
      entities: [wall1Id, wall2Id],
    };

    this.constraints.push(constraint);
    return constraint;
  }

  addPerpendicularConstraint(wall1Id: string, wall2Id: string): Constraint {
    const constraint: Constraint = {
      id: `perpendicular-${wall1Id}-${wall2Id}`,
      type: 'perpendicular',
      entities: [wall1Id, wall2Id],
    };

    this.constraints.push(constraint);
    return constraint;
  }

  addEqualLengthConstraint(wall1Id: string, wall2Id: string): Constraint {
    const constraint: Constraint = {
      id: `equal-${wall1Id}-${wall2Id}`,
      type: 'equal-length',
      entities: [wall1Id, wall2Id],
    };

    this.constraints.push(constraint);
    return constraint;
  }

  addFixedAngleConstraint(wallId: string, angle: number): Constraint {
    const constraint: Constraint = {
      id: `angle-${wallId}`,
      type: 'fixed-angle',
      entities: [wallId],
      value: angle,
    };

    this.constraints.push(constraint);
    return constraint;
  }

  addFixedDistanceConstraint(object1Id: string, object2Id: string, distance: number): Constraint {
    const constraint: Constraint = {
      id: `distance-${object1Id}-${object2Id}`,
      type: 'fixed-distance',
      entities: [object1Id, object2Id],
      value: distance,
    };

    this.constraints.push(constraint);
    return constraint;
  }

  applyConstraints(walls: Wall[]): Wall[] {
    const constrainedWalls = [...walls];

    for (const constraint of this.constraints) {
      switch (constraint.type) {
        case 'parallel':
          this.applyParallelConstraint(constrainedWalls, constraint);
          break;
        case 'perpendicular':
          this.applyPerpendicularConstraint(constrainedWalls, constraint);
          break;
        case 'equal-length':
          this.applyEqualLengthConstraint(constrainedWalls, constraint);
          break;
        case 'fixed-angle':
          this.applyFixedAngleConstraint(constrainedWalls, constraint);
          break;
      }
    }

    return constrainedWalls;
  }

  private applyParallelConstraint(walls: Wall[], constraint: Constraint) {
    const [wall1Id, wall2Id] = constraint.entities;
    const wall1 = walls.find((w) => w.id === wall1Id);
    const wall2 = walls.find((w) => w.id === wall2Id);

    if (!wall1 || !wall2) return;

    const angle1 = calculateAngle(
      { x: wall1.startX, y: wall1.startY },
      { x: wall1.endX, y: wall1.endY }
    );

    const length2 = calculateDistance(
      { x: wall2.startX, y: wall2.startY },
      { x: wall2.endX, y: wall2.endY }
    );

    wall2.endX = wall2.startX + length2 * Math.cos(angle1);
    wall2.endY = wall2.startY + length2 * Math.sin(angle1);
  }

  private applyPerpendicularConstraint(walls: Wall[], constraint: Constraint) {
    const [wall1Id, wall2Id] = constraint.entities;
    const wall1 = walls.find((w) => w.id === wall1Id);
    const wall2 = walls.find((w) => w.id === wall2Id);

    if (!wall1 || !wall2) return;

    const angle1 = calculateAngle(
      { x: wall1.startX, y: wall1.startY },
      { x: wall1.endX, y: wall1.endY }
    );

    const perpendicularAngle = angle1 + Math.PI / 2;
    const length2 = calculateDistance(
      { x: wall2.startX, y: wall2.startY },
      { x: wall2.endX, y: wall2.endY }
    );

    wall2.endX = wall2.startX + length2 * Math.cos(perpendicularAngle);
    wall2.endY = wall2.startY + length2 * Math.sin(perpendicularAngle);
  }

  private applyEqualLengthConstraint(walls: Wall[], constraint: Constraint) {
    const [wall1Id, wall2Id] = constraint.entities;
    const wall1 = walls.find((w) => w.id === wall1Id);
    const wall2 = walls.find((w) => w.id === wall2Id);

    if (!wall1 || !wall2) return;

    const length1 = calculateDistance(
      { x: wall1.startX, y: wall1.startY },
      { x: wall1.endX, y: wall1.endY }
    );

    const angle2 = calculateAngle(
      { x: wall2.startX, y: wall2.startY },
      { x: wall2.endX, y: wall2.endY }
    );

    wall2.endX = wall2.startX + length1 * Math.cos(angle2);
    wall2.endY = wall2.startY + length1 * Math.sin(angle2);
  }

  private applyFixedAngleConstraint(walls: Wall[], constraint: Constraint) {
    const wallId = constraint.entities[0];
    const wall = walls.find((w) => w.id === wallId);

    if (!wall || constraint.value === undefined) return;

    const length = calculateDistance(
      { x: wall.startX, y: wall.startY },
      { x: wall.endX, y: wall.endY }
    );

    wall.endX = wall.startX + length * Math.cos(constraint.value);
    wall.endY = wall.startY + length * Math.sin(constraint.value);
  }

  removeConstraint(constraintId: string) {
    this.constraints = this.constraints.filter((c) => c.id !== constraintId);
  }

  clearConstraints() {
    this.constraints = [];
  }

  getConstraints(): Constraint[] {
    return this.constraints;
  }
}

// MARK: - Auto Dimensioning

export interface Dimension {
  id: string;
  type: 'linear' | 'aligned' | 'angular' | 'radial';
  start: Point;
  end: Point;
  value: number;
  offset?: number;
  textPosition?: Point;
}

export class AutoDimensioning {
  private dimensions: Dimension[] = [];
  private offsetDistance: number = 1.0;

  constructor(offsetDistance: number = 1.0) {
    this.offsetDistance = offsetDistance;
  }

  addLinearDimension(start: Point, end: Point): Dimension {
    const distance = calculateDistance(start, end);

    const dimension: Dimension = {
      id: `dim-${Date.now()}`,
      type: 'linear',
      start,
      end,
      value: distance,
      offset: this.offsetDistance,
      textPosition: {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2 - this.offsetDistance,
      },
    };

    this.dimensions.push(dimension);
    return dimension;
  }

  addAngularDimension(center: Point, start: Point, end: Point): Dimension {
    const angle1 = calculateAngle(center, start);
    const angle2 = calculateAngle(center, end);
    let angleDiff = angle2 - angle1;

    // Normalize to 0-2π
    if (angleDiff < 0) angleDiff += 2 * Math.PI;

    const dimension: Dimension = {
      id: `dim-${Date.now()}`,
      type: 'angular',
      start,
      end,
      value: (angleDiff * 180) / Math.PI, // Convert to degrees
    };

    this.dimensions.push(dimension);
    return dimension;
  }

  autoDimensionRoom(walls: Wall[]): Dimension[] {
    const roomDimensions: Dimension[] = [];

    for (const wall of walls) {
      const start = { x: wall.startX, y: wall.startY };
      const end = { x: wall.endX, y: wall.endY };

      roomDimensions.push(this.addLinearDimension(start, end));
    }

    return roomDimensions;
  }

  getDimensions(): Dimension[] {
    return this.dimensions;
  }

  removeDimension(dimensionId: string) {
    this.dimensions = this.dimensions.filter((d) => d.id !== dimensionId);
  }

  clearDimensions() {
    this.dimensions = [];
  }
}

// MARK: - Export

export const editorAdvancedFeatures = {
  GridSnapping,
  SmartGuides,
  GeometricConstraints,
  AutoDimensioning,
};
