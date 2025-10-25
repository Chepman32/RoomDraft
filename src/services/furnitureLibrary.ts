/**
 * Furniture Library Service
 * Pre-defined furniture templates for placement
 */

import {Dimensions3D} from '@types/index';

export interface FurnitureTemplate {
  id: string;
  name: string;
  category: FurnitureCategory;
  dimensions: Dimensions3D;
  svgPath: string; // SVG path data for rendering
  isPro: boolean;
  tags: string[];
  defaultRotation: number; // degrees
}

export type FurnitureCategory =
  | 'seating'
  | 'tables'
  | 'beds'
  | 'storage'
  | 'kitchen'
  | 'bathroom'
  | 'doors'
  | 'windows'
  | 'lighting'
  | 'decor';

// ============================================================================
// Furniture Templates Database
// ============================================================================

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  // Seating
  {
    id: 'chair-dining',
    name: 'Dining Chair',
    category: 'seating',
    dimensions: {width: 0.5, height: 0.9, depth: 0.5},
    svgPath: 'M 10 10 L 40 10 L 40 40 L 10 40 Z M 15 5 L 35 5 L 35 10 L 15 10 Z',
    isPro: false,
    tags: ['chair', 'dining', 'seating'],
    defaultRotation: 0,
  },
  {
    id: 'sofa-3seat',
    name: '3-Seat Sofa',
    category: 'seating',
    dimensions: {width: 2.0, height: 0.8, depth: 0.9},
    svgPath: 'M 10 20 L 190 20 L 190 80 L 10 80 Z M 5 15 L 195 15 L 195 25 L 5 25 Z',
    isPro: false,
    tags: ['sofa', 'couch', 'living room'],
    defaultRotation: 0,
  },
  {
    id: 'armchair',
    name: 'Armchair',
    category: 'seating',
    dimensions: {width: 0.9, height: 0.9, depth: 0.9},
    svgPath: 'M 10 10 L 90 10 L 90 90 L 10 90 Z M 5 10 L 10 10 L 10 60 L 5 60 Z M 90 10 L 95 10 L 95 60 L 90 60 Z',
    isPro: false,
    tags: ['armchair', 'chair', 'seating'],
    defaultRotation: 0,
  },

  // Tables
  {
    id: 'table-dining-rect',
    name: 'Dining Table (Rectangular)',
    category: 'tables',
    dimensions: {width: 1.8, height: 0.75, depth: 0.9},
    svgPath: 'M 10 20 L 180 20 L 180 90 L 10 90 Z',
    isPro: false,
    tags: ['table', 'dining', 'rectangular'],
    defaultRotation: 0,
  },
  {
    id: 'table-dining-round',
    name: 'Dining Table (Round)',
    category: 'tables',
    dimensions: {width: 1.2, height: 0.75, depth: 1.2},
    svgPath: 'M 60 10 A 50 50 0 1 1 60 110 A 50 50 0 1 1 60 10',
    isPro: false,
    tags: ['table', 'dining', 'round'],
    defaultRotation: 0,
  },
  {
    id: 'coffee-table',
    name: 'Coffee Table',
    category: 'tables',
    dimensions: {width: 1.2, height: 0.4, depth: 0.6},
    svgPath: 'M 20 20 L 120 20 L 120 60 L 20 60 Z',
    isPro: false,
    tags: ['table', 'coffee', 'living room'],
    defaultRotation: 0,
  },
  {
    id: 'desk',
    name: 'Desk',
    category: 'tables',
    dimensions: {width: 1.4, height: 0.75, depth: 0.7},
    svgPath: 'M 10 15 L 140 15 L 140 70 L 10 70 Z M 10 70 L 20 70 L 20 80 L 10 80 Z M 130 70 L 140 70 L 140 80 L 130 80 Z',
    isPro: true,
    tags: ['desk', 'table', 'office'],
    defaultRotation: 0,
  },

  // Beds
  {
    id: 'bed-single',
    name: 'Single Bed',
    category: 'beds',
    dimensions: {width: 0.9, height: 0.5, depth: 2.0},
    svgPath: 'M 10 10 L 90 10 L 90 200 L 10 200 Z M 5 10 L 95 10 L 95 30 L 5 30 Z',
    isPro: false,
    tags: ['bed', 'single', 'bedroom'],
    defaultRotation: 0,
  },
  {
    id: 'bed-double',
    name: 'Double Bed',
    category: 'beds',
    dimensions: {width: 1.4, height: 0.5, depth: 2.0},
    svgPath: 'M 10 10 L 140 10 L 140 200 L 10 200 Z M 5 10 L 145 10 L 145 30 L 5 30 Z',
    isPro: false,
    tags: ['bed', 'double', 'queen', 'bedroom'],
    defaultRotation: 0,
  },
  {
    id: 'bed-king',
    name: 'King Bed',
    category: 'beds',
    dimensions: {width: 1.8, height: 0.5, depth: 2.0},
    svgPath: 'M 10 10 L 180 10 L 180 200 L 10 200 Z M 5 10 L 185 10 L 185 30 L 5 30 Z',
    isPro: true,
    tags: ['bed', 'king', 'bedroom'],
    defaultRotation: 0,
  },

  // Storage
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'storage',
    dimensions: {width: 1.2, height: 2.0, depth: 0.6},
    svgPath: 'M 10 10 L 120 10 L 120 60 L 10 60 Z M 62 10 L 68 10 L 68 60 L 62 60 Z',
    isPro: false,
    tags: ['wardrobe', 'closet', 'storage'],
    defaultRotation: 0,
  },
  {
    id: 'dresser',
    name: 'Dresser',
    category: 'storage',
    dimensions: {width: 1.2, height: 0.9, depth: 0.5},
    svgPath: 'M 10 10 L 120 10 L 120 50 L 10 50 Z M 10 30 L 120 30',
    isPro: false,
    tags: ['dresser', 'storage', 'bedroom'],
    defaultRotation: 0,
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    category: 'storage',
    dimensions: {width: 0.8, height: 2.0, depth: 0.3},
    svgPath: 'M 10 10 L 80 10 L 80 30 L 10 30 Z M 10 40 L 80 40 L 80 60 L 10 60 Z M 10 70 L 80 70 L 80 90 L 10 90 Z',
    isPro: true,
    tags: ['bookshelf', 'storage', 'shelving'],
    defaultRotation: 0,
  },

  // Kitchen
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    category: 'kitchen',
    dimensions: {width: 0.7, height: 1.8, depth: 0.7},
    svgPath: 'M 10 10 L 70 10 L 70 70 L 10 70 Z M 10 40 L 70 40',
    isPro: false,
    tags: ['refrigerator', 'fridge', 'kitchen', 'appliance'],
    defaultRotation: 0,
  },
  {
    id: 'stove',
    name: 'Stove',
    category: 'kitchen',
    dimensions: {width: 0.6, height: 0.9, depth: 0.6},
    svgPath: 'M 10 10 L 60 10 L 60 60 L 10 60 Z M 20 20 A 8 8 0 1 1 20 36 A 8 8 0 1 1 20 20 M 40 20 A 8 8 0 1 1 40 36 A 8 8 0 1 1 40 20',
    isPro: false,
    tags: ['stove', 'oven', 'kitchen', 'appliance'],
    defaultRotation: 0,
  },
  {
    id: 'kitchen-island',
    name: 'Kitchen Island',
    category: 'kitchen',
    dimensions: {width: 1.5, height: 0.9, depth: 0.9},
    svgPath: 'M 10 10 L 150 10 L 150 90 L 10 90 Z M 10 50 L 150 50',
    isPro: true,
    tags: ['island', 'kitchen', 'counter'],
    defaultRotation: 0,
  },

  // Bathroom
  {
    id: 'bathtub',
    name: 'Bathtub',
    category: 'bathroom',
    dimensions: {width: 0.75, height: 0.6, depth: 1.7},
    svgPath: 'M 10 10 L 75 10 L 75 170 L 10 170 Z M 5 10 L 5 170 A 5 5 0 0 0 10 175 L 75 175 A 5 5 0 0 0 80 170 L 80 10',
    isPro: false,
    tags: ['bathtub', 'tub', 'bathroom'],
    defaultRotation: 0,
  },
  {
    id: 'shower',
    name: 'Shower',
    category: 'bathroom',
    dimensions: {width: 0.9, height: 2.0, depth: 0.9},
    svgPath: 'M 10 10 L 90 10 L 90 90 L 10 90 Z M 10 10 L 30 30 M 30 10 L 10 30',
    isPro: false,
    tags: ['shower', 'bathroom'],
    defaultRotation: 0,
  },
  {
    id: 'toilet',
    name: 'Toilet',
    category: 'bathroom',
    dimensions: {width: 0.4, height: 0.7, depth: 0.7},
    svgPath: 'M 20 10 A 20 20 0 0 0 20 50 L 20 70 L 60 70 L 60 50 A 20 20 0 0 0 60 10 Z',
    isPro: false,
    tags: ['toilet', 'bathroom'],
    defaultRotation: 0,
  },
  {
    id: 'sink',
    name: 'Sink',
    category: 'bathroom',
    dimensions: {width: 0.5, height: 0.2, depth: 0.4},
    svgPath: 'M 15 15 A 20 20 0 1 1 15 55 A 20 20 0 1 1 15 35',
    isPro: false,
    tags: ['sink', 'bathroom', 'vanity'],
    defaultRotation: 0,
  },

  // Doors
  {
    id: 'door-single',
    name: 'Single Door',
    category: 'doors',
    dimensions: {width: 0.9, height: 2.1, depth: 0.05},
    svgPath: 'M 5 10 L 5 90 L 90 90 A 85 85 0 0 0 5 10',
    isPro: false,
    tags: ['door', 'single', 'entry'],
    defaultRotation: 0,
  },
  {
    id: 'door-double',
    name: 'Double Door',
    category: 'doors',
    dimensions: {width: 1.8, height: 2.1, depth: 0.05},
    svgPath: 'M 5 10 L 5 90 L 90 90 A 85 85 0 0 0 5 10 M 95 10 L 95 90 L 10 90 A 85 85 0 0 1 95 10',
    isPro: false,
    tags: ['door', 'double', 'entry'],
    defaultRotation: 0,
  },
  {
    id: 'sliding-door',
    name: 'Sliding Door',
    category: 'doors',
    dimensions: {width: 1.5, height: 2.1, depth: 0.05},
    svgPath: 'M 10 10 L 75 10 L 75 100 L 10 100 Z M 75 10 L 150 10 L 150 100 L 75 100 Z',
    isPro: true,
    tags: ['door', 'sliding', 'patio'],
    defaultRotation: 0,
  },

  // Windows
  {
    id: 'window-single',
    name: 'Single Window',
    category: 'windows',
    dimensions: {width: 0.6, height: 1.2, depth: 0.1},
    svgPath: 'M 10 10 L 60 10 L 60 120 L 10 120 Z M 10 65 L 60 65 M 35 10 L 35 120',
    isPro: false,
    tags: ['window', 'single'],
    defaultRotation: 0,
  },
  {
    id: 'window-double',
    name: 'Double Window',
    category: 'windows',
    dimensions: {width: 1.2, height: 1.2, depth: 0.1},
    svgPath: 'M 10 10 L 120 10 L 120 120 L 10 120 Z M 10 65 L 120 65 M 35 10 L 35 120 M 95 10 L 95 120 M 65 10 L 65 120',
    isPro: false,
    tags: ['window', 'double'],
    defaultRotation: 0,
  },
  {
    id: 'bay-window',
    name: 'Bay Window',
    category: 'windows',
    dimensions: {width: 2.0, height: 1.5, depth: 0.5},
    svgPath: 'M 20 10 L 80 10 L 100 30 L 100 90 L 80 110 L 20 110 L 0 90 L 0 30 Z',
    isPro: true,
    tags: ['window', 'bay', 'feature'],
    defaultRotation: 0,
  },
];

// ============================================================================
// Furniture Library Service
// ============================================================================

export class FurnitureLibraryService {
  private templates: FurnitureTemplate[];

  constructor() {
    this.templates = FURNITURE_TEMPLATES;
  }

  // Get all templates
  getAllTemplates(includeProOnly: boolean = false): FurnitureTemplate[] {
    if (includeProOnly) {
      return this.templates;
    }
    return this.templates.filter(t => !t.isPro);
  }

  // Get templates by category
  getTemplatesByCategory(
    category: FurnitureCategory,
    includeProOnly: boolean = false,
  ): FurnitureTemplate[] {
    const templates = this.getAllTemplates(includeProOnly);
    return templates.filter(t => t.category === category);
  }

  // Get template by ID
  getTemplateById(id: string): FurnitureTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  // Search templates
  searchTemplates(query: string, includeProOnly: boolean = false): FurnitureTemplate[] {
    const templates = this.getAllTemplates(includeProOnly);
    const lowerQuery = query.toLowerCase();

    return templates.filter(
      t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  // Get all categories
  getCategories(): FurnitureCategory[] {
    return Array.from(new Set(this.templates.map(t => t.category)));
  }

  // Check if template requires Pro
  requiresPro(templateId: string): boolean {
    const template = this.getTemplateById(templateId);
    return template?.isPro || false;
  }
}

export const furnitureLibrary = new FurnitureLibraryService();
