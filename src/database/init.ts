/**
 * Database Initialization
 */

import {sql} from 'drizzle-orm';
import db from './client';

// ============================================================================
// Initialize Database
// ============================================================================

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create tables
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        thumbnail_uri TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_pro INTEGER NOT NULL DEFAULT 0
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        scale REAL NOT NULL DEFAULT 0.01,
        width INTEGER NOT NULL DEFAULT 1000,
        height INTEGER NOT NULL DEFAULT 1000,
        capture_method TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        name TEXT NOT NULL,
        area REAL NOT NULL DEFAULT 0,
        perimeter REAL NOT NULL DEFAULT 0,
        walls TEXT,
        color TEXT NOT NULL DEFAULT '#2196F3',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS walls (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL,
        start_x REAL NOT NULL,
        start_y REAL NOT NULL,
        end_x REAL NOT NULL,
        end_y REAL NOT NULL,
        thickness REAL NOT NULL DEFAULT 0.2,
        height REAL NOT NULL DEFAULT 2.5,
        type TEXT NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS placed_objects (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        room_id TEXT,
        type TEXT NOT NULL,
        template_id TEXT,
        position_x REAL NOT NULL,
        position_y REAL NOT NULL,
        rotation REAL NOT NULL DEFAULT 0,
        width REAL NOT NULL,
        height REAL NOT NULL,
        depth REAL NOT NULL,
        metadata TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS exports (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        format TEXT NOT NULL,
        file_uri TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        purchase_date TEXT NOT NULL,
        expiration_date TEXT,
        is_active INTEGER NOT NULL DEFAULT 1
      )
    `);

    // Create indices for better query performance
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_plans_project ON plans(project_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_rooms_plan ON rooms(plan_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_walls_room ON walls(room_id)`);
    await db.run(
      sql`CREATE INDEX IF NOT EXISTS idx_placed_objects_plan ON placed_objects(plan_id)`,
    );
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_exports_project ON exports(project_id)`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
