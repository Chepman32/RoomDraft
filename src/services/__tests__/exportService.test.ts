import {
  SVGExporter,
  DXFExporter,
  PDFExporter,
  PNGExporter,
} from '../exportService';
import type { Plan, Room, PlacedObject } from '@/types';

const mockPlan: Partial<Plan> = {
  id: 'plan-1',
  name: 'First Floor',
  scale: 0.01,
};

const mockRooms: Partial<Room>[] = [
  {
    id: 'room-1',
    planId: 'plan-1',
    name: 'Living Room',
    type: 'living',
    area: 25,
  },
];

const mockObjects: Partial<PlacedObject>[] = [
  {
    id: 'obj-1',
    planId: 'plan-1',
    templateId: 'chair-dining',
    x: 5,
    y: 5,
    rotation: 0,
    scale: 1,
  },
];

describe('Export Service', () => {
  describe('SVGExporter', () => {
    let exporter: SVGExporter;

    beforeEach(() => {
      exporter = new SVGExporter();
    });

    it('should generate SVG with basic structure', () => {
      const svg = exporter.generateSVG(
        mockPlan as Plan,
        mockRooms as Room[],
        mockObjects as PlacedObject[],
        {}
      );

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should include rooms in SVG', () => {
      const svg = exporter.generateSVG(
        mockPlan as Plan,
        mockRooms as Room[],
        [],
        {}
      );

      expect(svg).toContain('Living Room');
    });

    it('should include grid when enabled', () => {
      const svg = exporter.generateSVG(
        mockPlan as Plan,
        [],
        [],
        { includeGrid: true }
      );

      expect(svg).toContain('grid');
    });

    it('should include measurements when enabled', () => {
      const svg = exporter.generateSVG(
        mockPlan as Plan,
        mockRooms as Room[],
        [],
        { includeMeasurements: true }
      );

      expect(svg).toContain('measurement');
    });
  });

  describe('DXFExporter', () => {
    let exporter: DXFExporter;

    beforeEach(() => {
      exporter = new DXFExporter();
    });

    it('should generate DXF with header', () => {
      const dxf = exporter.generateDXF(
        mockPlan as Plan,
        mockRooms as Room[],
        mockObjects as PlacedObject[],
        {}
      );

      expect(dxf).toContain('0\nSECTION');
      expect(dxf).toContain('2\nHEADER');
      expect(dxf).toContain('0\nENDSEC');
    });

    it('should include entities section', () => {
      const dxf = exporter.generateDXF(
        mockPlan as Plan,
        mockRooms as Room[],
        [],
        {}
      );

      expect(dxf).toContain('2\nENTITIES');
    });

    it('should include layers', () => {
      const dxf = exporter.generateDXF(
        mockPlan as Plan,
        mockRooms as Room[],
        [],
        {}
      );

      expect(dxf).toContain('2\nTABLES');
      expect(dxf).toContain('LAYER');
    });
  });

  describe('PDFExporter', () => {
    let exporter: PDFExporter;

    beforeEach(() => {
      exporter = new PDFExporter();
    });

    it('should generate HTML for PDF', () => {
      const html = exporter['generateHTML'](
        mockPlan as Plan,
        mockRooms as Room[],
        mockObjects as PlacedObject[],
        {}
      );

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
    });

    it('should include plan name in HTML', () => {
      const html = exporter['generateHTML'](
        mockPlan as Plan,
        [],
        [],
        {}
      );

      expect(html).toContain('First Floor');
    });

    it('should include CSS styles', () => {
      const html = exporter['generateHTML'](
        mockPlan as Plan,
        [],
        [],
        {}
      );

      expect(html).toContain('<style>');
      expect(html).toContain('</style>');
    });
  });

  describe('PNGExporter', () => {
    let exporter: PNGExporter;

    beforeEach(() => {
      exporter = new PNGExporter();
    });

    it('should have correct default options', () => {
      const options = {};
      const result = exporter['getExportOptions'](options);

      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
      expect(result.quality).toBe(0.95);
    });

    it('should merge custom options', () => {
      const options = { width: 3840, height: 2160 };
      const result = exporter['getExportOptions'](options);

      expect(result.width).toBe(3840);
      expect(result.height).toBe(2160);
    });
  });
});
