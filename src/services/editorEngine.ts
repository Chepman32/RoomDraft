/**
 * Editor Engine
 * Core editor functionality for floor plan editing
 */

import {Point, Wall, Room, PlacedObject, EditorMode} from '@types/index';
import {
  distance,
  snapToGrid,
  snapToPoint,
  polygonArea,
  polygonPerimeter,
  angleBetweenPoints,
} from '@utils/geometry';
import {APP_CONFIG, VALIDATION} from '@utils/constants';

// ============================================================================
// Wall Drawing Tool
// ============================================================================

export class WallDrawingTool {
  private startPoint: Point | null = null;
  private currentPoint: Point | null = null;
  private gridSize: number;
  private snapEnabled: boolean;

  constructor(gridSize: number = 0.5, snapEnabled: boolean = true) {
    this.gridSize = gridSize;
    this.snapEnabled = snapEnabled;
  }

  // Start drawing a wall
  startWall(point: Point): void {
    this.startPoint = this.snapEnabled ? snapToGrid(point, this.gridSize * 100) : point;
    this.currentPoint = this.startPoint;
  }

  // Update wall endpoint
  updateWall(point: Point): void {
    if (!this.startPoint) return;

    this.currentPoint = this.snapEnabled ? snapToGrid(point, this.gridSize * 100) : point;

    // Snap to horizontal or vertical if close
    if (this.snapEnabled) {
      const angle = Math.abs(angleBetweenPoints(this.startPoint, this.currentPoint));

      if (Math.abs(angle) < 5 || Math.abs(angle - 180) < 5) {
        // Snap to horizontal
        this.currentPoint = {...this.currentPoint, y: this.startPoint.y};
      } else if (Math.abs(angle - 90) < 5 || Math.abs(angle - 270) < 5) {
        // Snap to vertical
        this.currentPoint = {...this.currentPoint, x: this.startPoint.x};
      }
    }
  }

  // Finish drawing and return wall
  finishWall(): Omit<Wall, 'id' | 'roomId'> | null {
    if (!this.startPoint || !this.currentPoint) return null;

    const wallLength = distance(this.startPoint, this.currentPoint);

    // Validate minimum length
    if (wallLength < VALIDATION.wall.minLength * 100) {
      this.reset();
      return null;
    }

    const wall: Omit<Wall, 'id' | 'roomId'> = {
      start: this.startPoint,
      end: this.currentPoint,
      thickness: APP_CONFIG.measurements.defaultWallHeight * 100,
      height: APP_CONFIG.measurements.defaultWallHeight,
      type: 'interior',
    };

    this.reset();
    return wall;
  }

  // Get preview wall for rendering
  getPreview(): {start: Point; end: Point} | null {
    if (!this.startPoint || !this.currentPoint) return null;

    return {
      start: this.startPoint,
      end: this.currentPoint,
    };
  }

  // Reset tool
  reset(): void {
    this.startPoint = null;
    this.currentPoint = null;
  }

  // Set grid size
  setGridSize(size: number): void {
    this.gridSize = size;
  }

  // Toggle snap
  toggleSnap(): void {
    this.snapEnabled = !this.snapEnabled;
  }
}

// ============================================================================
// Room Creation Tool
// ============================================================================

export class RoomCreationTool {
  private points: Point[] = [];
  private closed: boolean = false;

  // Add point to room boundary
  addPoint(point: Point, snapEnabled: boolean = true, gridSize: number = 0.5): void {
    const snappedPoint = snapEnabled ? snapToGrid(point, gridSize * 100) : point;

    // Check if closing the room (near first point)
    if (this.points.length >= 3) {
      const distToFirst = distance(snappedPoint, this.points[0]);
      if (distToFirst < 20) {
        this.closed = true;
        return;
      }
    }

    this.points.push(snappedPoint);
  }

  // Remove last point
  removeLastPoint(): void {
    this.points.pop();
    this.closed = false;
  }

  // Get preview points for rendering
  getPreview(): Point[] {
    return [...this.points];
  }

  // Check if room is complete
  isComplete(): boolean {
    return this.closed && this.points.length >= 3;
  }

  // Finish and return room data
  finishRoom(name: string = 'New Room'): Omit<Room, 'id' | 'planId' | 'createdAt' | 'updatedAt'> | null {
    if (!this.isComplete()) return null;

    const area = polygonArea(this.points) * Math.pow(APP_CONFIG.measurements.defaultScale, 2);
    const perimeter = polygonPerimeter(this.points) * APP_CONFIG.measurements.defaultScale;

    const walls = this.pointsToWalls(this.points);

    const room: Omit<Room, 'id' | 'planId' | 'createdAt' | 'updatedAt'> = {
      name,
      area,
      perimeter,
      walls: JSON.stringify(walls) as any,
      color: '#2196F3',
    };

    this.reset();
    return room;
  }

  // Convert points to walls
  private pointsToWalls(points: Point[]): Omit<Wall, 'id' | 'roomId'>[] {
    const walls: Omit<Wall, 'id' | 'roomId'>[] = [];

    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];

      walls.push({
        start,
        end,
        thickness: APP_CONFIG.measurements.defaultWallHeight * 100,
        height: APP_CONFIG.measurements.defaultWallHeight,
        type: 'interior',
      });
    }

    return walls;
  }

  // Reset tool
  reset(): void {
    this.points = [];
    this.closed = false;
  }

  // Get point count
  getPointCount(): number {
    return this.points.length;
  }
}

// ============================================================================
// Object Placement Tool
// ============================================================================

export class ObjectPlacementTool {
  private templateId: string | null = null;
  private position: Point | null = null;
  private rotation: number = 0;

  // Set template to place
  setTemplate(templateId: string): void {
    this.templateId = templateId;
    this.rotation = 0;
  }

  // Update position
  setPosition(point: Point, snapEnabled: boolean = true, gridSize: number = 0.5): void {
    this.position = snapEnabled ? snapToGrid(point, gridSize * 100) : point;
  }

  // Rotate object
  rotate(degrees: number): void {
    this.rotation = (this.rotation + degrees) % 360;
  }

  // Set absolute rotation
  setRotation(degrees: number): void {
    this.rotation = degrees % 360;
  }

  // Place object and return data
  placeObject(
    planId: string,
    roomId: string | null,
    dimensions: {width: number; height: number; depth: number},
  ): Omit<PlacedObject, 'id' | 'createdAt'> | null {
    if (!this.templateId || !this.position) return null;

    const obj: Omit<PlacedObject, 'id' | 'createdAt'> = {
      planId,
      roomId,
      type: 'furniture',
      templateId: this.templateId,
      positionX: this.position.x,
      positionY: this.position.y,
      rotation: this.rotation,
      width: dimensions.width,
      height: dimensions.height,
      depth: dimensions.depth,
      metadata: {},
    };

    return obj;
  }

  // Get preview for rendering
  getPreview(): {position: Point; rotation: number; templateId: string} | null {
    if (!this.templateId || !this.position) return null;

    return {
      position: this.position,
      rotation: this.rotation,
      templateId: this.templateId,
    };
  }

  // Reset tool
  reset(): void {
    this.templateId = null;
    this.position = null;
    this.rotation = 0;
  }
}

// ============================================================================
// Selection Tool
// ============================================================================

export class SelectionTool {
  private selectedObjectIds: Set<string> = new Set();
  private selectedRoomIds: Set<string> = new Set();
  private selectedWallIds: Set<string> = new Set();
  private selectionBox: {start: Point; end: Point} | null = null;

  // Select object
  selectObject(id: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.clearAll();
    }

    this.selectedObjectIds.add(id);
  }

  // Select room
  selectRoom(id: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.clearAll();
    }

    this.selectedRoomIds.add(id);
  }

  // Select wall
  selectWall(id: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.clearAll();
    }

    this.selectedWallIds.add(id);
  }

  // Deselect object
  deselectObject(id: string): void {
    this.selectedObjectIds.delete(id);
  }

  // Deselect room
  deselectRoom(id: string): void {
    this.selectedRoomIds.delete(id);
  }

  // Deselect wall
  deselectWall(id: string): void {
    this.selectedWallIds.delete(id);
  }

  // Clear all selections
  clearAll(): void {
    this.selectedObjectIds.clear();
    this.selectedRoomIds.clear();
    this.selectedWallIds.clear();
    this.selectionBox = null;
  }

  // Start selection box
  startSelectionBox(point: Point): void {
    this.selectionBox = {start: point, end: point};
  }

  // Update selection box
  updateSelectionBox(point: Point): void {
    if (!this.selectionBox) return;

    this.selectionBox.end = point;
  }

  // Finish selection box
  finishSelectionBox(): void {
    this.selectionBox = null;
  }

  // Get selection box for rendering
  getSelectionBox(): {start: Point; end: Point} | null {
    return this.selectionBox;
  }

  // Get selected IDs
  getSelectedObjects(): string[] {
    return Array.from(this.selectedObjectIds);
  }

  getSelectedRooms(): string[] {
    return Array.from(this.selectedRoomIds);
  }

  getSelectedWalls(): string[] {
    return Array.from(this.selectedWallIds);
  }

  // Check if anything is selected
  hasSelection(): boolean {
    return (
      this.selectedObjectIds.size > 0 ||
      this.selectedRoomIds.size > 0 ||
      this.selectedWallIds.size > 0
    );
  }
}

// ============================================================================
// Measurement Tool
// ============================================================================

export class MeasurementTool {
  private startPoint: Point | null = null;
  private endPoint: Point | null = null;

  // Start measurement
  start(point: Point): void {
    this.startPoint = point;
    this.endPoint = point;
  }

  // Update measurement
  update(point: Point): void {
    if (!this.startPoint) return;

    this.endPoint = point;
  }

  // Get measurement in meters
  getMeasurement(): number | null {
    if (!this.startPoint || !this.endPoint) return null;

    const pixels = distance(this.startPoint, this.endPoint);
    return pixels * APP_CONFIG.measurements.defaultScale;
  }

  // Get preview for rendering
  getPreview(): {start: Point; end: Point; distance: number} | null {
    const measurement = this.getMeasurement();
    if (!this.startPoint || !this.endPoint || measurement === null) return null;

    return {
      start: this.startPoint,
      end: this.endPoint,
      distance: measurement,
    };
  }

  // Reset tool
  reset(): void {
    this.startPoint = null;
    this.endPoint = null;
  }
}

// ============================================================================
// Editor Engine
// ============================================================================

export class EditorEngine {
  public wallTool: WallDrawingTool;
  public roomTool: RoomCreationTool;
  public objectTool: ObjectPlacementTool;
  public selectionTool: SelectionTool;
  public measurementTool: MeasurementTool;

  private currentMode: EditorMode = 'select';
  private gridSize: number = 0.5;
  private snapEnabled: boolean = true;

  constructor() {
    this.wallTool = new WallDrawingTool(this.gridSize, this.snapEnabled);
    this.roomTool = new RoomCreationTool();
    this.objectTool = new ObjectPlacementTool();
    this.selectionTool = new SelectionTool();
    this.measurementTool = new MeasurementTool();
  }

  // Set editor mode
  setMode(mode: EditorMode): void {
    this.currentMode = mode;

    // Reset tools when changing modes
    this.wallTool.reset();
    this.roomTool.reset();
    this.objectTool.reset();
    this.measurementTool.reset();
  }

  // Get current mode
  getMode(): EditorMode {
    return this.currentMode;
  }

  // Set grid size
  setGridSize(size: number): void {
    this.gridSize = size;
    this.wallTool.setGridSize(size);
  }

  // Toggle snap
  toggleSnap(): void {
    this.snapEnabled = !this.snapEnabled;
    this.wallTool.toggleSnap();
  }

  // Get snap state
  isSnapEnabled(): boolean {
    return this.snapEnabled;
  }
}

export const editorEngine = new EditorEngine();
