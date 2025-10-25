/**
 * Database Client - SQLite with Drizzle ORM
 */

import {drizzle} from 'drizzle-orm/op-sqlite';
import {open} from '@op-engineering/op-sqlite';
import * as schema from './schema';

// ============================================================================
// Database Connection
// ============================================================================

const sqlite = open({
  name: 'roomdraft.db',
  location: '../files/databases',
});

export const db = drizzle(sqlite, {schema});

// ============================================================================
// Database Helpers
// ============================================================================

export const closeDatabase = () => {
  sqlite.close();
};

export const deleteDatabase = () => {
  sqlite.delete();
};

export default db;
