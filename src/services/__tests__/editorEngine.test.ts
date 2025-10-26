import {
  WallDrawingTool,
  RoomCreationTool,
  ObjectPlacementTool,
  SelectionTool,
  MeasurementTool,
} from '../editorEngine';
import { Point } from '@/types';

describe('Editor Engine', () => {
  describe('WallDrawingTool', () => {
    let tool: WallDrawingTool;

    beforeEach(() => {
      tool = new WallDrawingTool(0.2);
    });

    it('should start a wall at a point', () => {
      const point: Point = { x: 0, y: 0 };
      tool.startWall(point);
      expect(tool['startPoint']).toEqual(point);
    });

    it('should update wall endpoint', () => {
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 0 };

      tool.startWall(start);
      tool.updateWall(end);

      expect(tool['endPoint']).toEqual(end);
    });

    it('should finish wall and return wall data', () => {
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 0 };

      tool.startWall(start);
      tool.updateWall(end);
      const wall = tool.finishWall();

      expect(wall).toHaveProperty('startX', 0);
      expect(wall).toHaveProperty('startY', 0);
      expect(wall).toHaveProperty('endX', 10);
      expect(wall).toHaveProperty('endY', 0);
      expect(wall).toHaveProperty('thickness', 0.2);
    });

    it('should return null if wall is too short', () => {
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 0.01, y: 0 };

      tool.startWall(start);
      tool.updateWall(end);
      const wall = tool.finishWall();

      expect(wall).toBeNull();
    });
  });

  describe('RoomCreationTool', () => {
    let tool: RoomCreationTool;

    beforeEach(() => {
      tool = new RoomCreationTool();
    });

    it('should add points to room boundary', () => {
      tool.addPoint({ x: 0, y: 0 });
      tool.addPoint({ x: 10, y: 0 });
      tool.addPoint({ x: 10, y: 10 });

      expect(tool['points'].length).toBe(3);
    });

    it('should create room from points', () => {
      tool.addPoint({ x: 0, y: 0 });
      tool.addPoint({ x: 10, y: 0 });
      tool.addPoint({ x: 10, y: 10 });
      tool.addPoint({ x: 0, y: 10 });

      const room = tool.finishRoom('Living Room', 'living');

      expect(room).toHaveProperty('name', 'Living Room');
      expect(room).toHaveProperty('type', 'living');
      expect(room?.area).toBeGreaterThan(0);
    });

    it('should return null if not enough points', () => {
      tool.addPoint({ x: 0, y: 0 });
      tool.addPoint({ x: 10, y: 0 });

      const room = tool.finishRoom('Test', 'living');
      expect(room).toBeNull();
    });
  });

  describe('ObjectPlacementTool', () => {
    let tool: ObjectPlacementTool;

    beforeEach(() => {
      tool = new ObjectPlacementTool();
    });

    it('should place an object at a point', () => {
      const object = tool.placeObject('chair-dining', { x: 5, y: 5 });

      expect(object).toHaveProperty('templateId', 'chair-dining');
      expect(object).toHaveProperty('x', 5);
      expect(object).toHaveProperty('y', 5);
      expect(object).toHaveProperty('rotation', 0);
      expect(object).toHaveProperty('scale', 1);
    });

    it('should set active template', () => {
      tool.setActiveTemplate('table-dining');
      expect(tool['activeTemplateId']).toBe('table-dining');
    });
  });

  describe('SelectionTool', () => {
    let tool: SelectionTool;

    beforeEach(() => {
      tool = new SelectionTool();
    });

    it('should select an item', () => {
      tool.select('item-1');
      expect(tool.getSelection()).toEqual(['item-1']);
    });

    it('should support multi-select', () => {
      tool.select('item-1');
      tool.addToSelection('item-2');
      expect(tool.getSelection()).toEqual(['item-1', 'item-2']);
    });

    it('should deselect an item', () => {
      tool.select('item-1');
      tool.addToSelection('item-2');
      tool.removeFromSelection('item-1');
      expect(tool.getSelection()).toEqual(['item-2']);
    });

    it('should clear selection', () => {
      tool.select('item-1');
      tool.addToSelection('item-2');
      tool.clearSelection();
      expect(tool.getSelection()).toEqual([]);
    });

    it('should toggle selection', () => {
      tool.select('item-1');
      tool.toggleSelection('item-1');
      expect(tool.getSelection()).toEqual([]);

      tool.toggleSelection('item-2');
      expect(tool.getSelection()).toEqual(['item-2']);
    });
  });

  describe('MeasurementTool', () => {
    let tool: MeasurementTool;

    beforeEach(() => {
      tool = new MeasurementTool();
    });

    it('should start measurement', () => {
      tool.startMeasurement({ x: 0, y: 0 });
      expect(tool['startPoint']).toEqual({ x: 0, y: 0 });
    });

    it('should calculate distance', () => {
      tool.startMeasurement({ x: 0, y: 0 });
      const measurement = tool.getMeasurement({ x: 3, y: 4 });

      expect(measurement.distance).toBe(5); // 3-4-5 triangle
    });

    it('should finish measurement', () => {
      tool.startMeasurement({ x: 0, y: 0 });
      const result = tool.finishMeasurement({ x: 10, y: 0 });

      expect(result).toHaveProperty('distance', 10);
    });
  });
});
