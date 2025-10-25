/**
 * Database Schema - Drizzle ORM with SQLite
 */

import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';

// ============================================================================
// Projects Table
// ============================================================================

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailUri: text('thumbnail_uri'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  isPro: integer('is_pro', {mode: 'boolean'}).notNull().default(false),
});

// ============================================================================
// Plans Table
// ============================================================================

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, {onDelete: 'cascade'}),
  title: text('title').notNull(),
  scale: real('scale').notNull().default(0.01), // meters per pixel
  width: integer('width').notNull().default(1000),
  height: integer('height').notNull().default(1000),
  captureMethod: text('capture_method', {
    enum: ['ar', 'manual', 'lidar'],
  }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================================================
// Rooms Table
// ============================================================================

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, {onDelete: 'cascade'}),
  name: text('name').notNull(),
  area: real('area').notNull().default(0),
  perimeter: real('perimeter').notNull().default(0),
  walls: text('walls', {mode: 'json'}), // JSON array of Wall objects
  color: text('color').notNull().default('#2196F3'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================================================
// Walls Table
// ============================================================================

export const walls = sqliteTable('walls', {
  id: text('id').primaryKey(),
  roomId: text('room_id')
    .notNull()
    .references(() => rooms.id, {onDelete: 'cascade'}),
  startX: real('start_x').notNull(),
  startY: real('start_y').notNull(),
  endX: real('end_x').notNull(),
  endY: real('end_y').notNull(),
  thickness: real('thickness').notNull().default(0.2),
  height: real('height').notNull().default(2.5),
  type: text('type', {enum: ['exterior', 'interior', 'structural']}).notNull(),
});

// ============================================================================
// Placed Objects Table
// ============================================================================

export const placedObjects = sqliteTable('placed_objects', {
  id: text('id').primaryKey(),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, {onDelete: 'cascade'}),
  roomId: text('room_id').references(() => rooms.id, {onDelete: 'set null'}),
  type: text('type', {
    enum: ['furniture', 'fixture', 'door', 'window', 'custom'],
  }).notNull(),
  templateId: text('template_id'),
  positionX: real('position_x').notNull(),
  positionY: real('position_y').notNull(),
  rotation: real('rotation').notNull().default(0),
  width: real('width').notNull(),
  height: real('height').notNull(),
  depth: real('depth').notNull(),
  metadata: text('metadata', {mode: 'json'}),
  createdAt: text('created_at').notNull(),
});

// ============================================================================
// Exports Table
// ============================================================================

export const exports = sqliteTable('exports', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, {onDelete: 'cascade'}),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, {onDelete: 'cascade'}),
  format: text('format', {enum: ['pdf', 'svg', 'dxf', 'png']}).notNull(),
  fileUri: text('file_uri').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: text('created_at').notNull(),
});

// ============================================================================
// Purchases Table (IAP)
// ============================================================================

export const purchases = sqliteTable('purchases', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  transactionId: text('transaction_id').notNull(),
  purchaseDate: text('purchase_date').notNull(),
  expirationDate: text('expiration_date'),
  isActive: integer('is_active', {mode: 'boolean'}).notNull().default(true),
});

// ============================================================================
// Type Exports
// ============================================================================

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;

export type Wall = typeof walls.$inferSelect;
export type NewWall = typeof walls.$inferInsert;

export type PlacedObject = typeof placedObjects.$inferSelect;
export type NewPlacedObject = typeof placedObjects.$inferInsert;

export type Export = typeof exports.$inferSelect;
export type NewExport = typeof exports.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
