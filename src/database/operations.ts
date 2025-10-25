/**
 * Database Operations - Complete CRUD Layer
 * Production-ready database service for all entities
 */

import {eq, desc, and} from 'drizzle-orm';
import db from './client';
import * as schema from './schema';
import {v4 as uuidv4} from 'uuid';

// ============================================================================
// Project Operations
// ============================================================================

export const projectOperations = {
  async create(data: Omit<schema.NewProject, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const project: schema.NewProject = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(schema.projects).values(project).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt));
  },

  async findById(id: string) {
    const result = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    return result[0];
  },

  async update(id: string, data: Partial<schema.Project>) {
    const result = await db
      .update(schema.projects)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(schema.projects.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  },

  async search(query: string) {
    const allProjects = await this.findAll();
    return allProjects.filter(
      p => p.title.toLowerCase().includes(query.toLowerCase()) ||
           p.description?.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// ============================================================================
// Plan Operations
// ============================================================================

export const planOperations = {
  async create(data: Omit<schema.NewPlan, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const plan: schema.NewPlan = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(schema.plans).values(plan).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.plans).orderBy(desc(schema.plans.updatedAt));
  },

  async findById(id: string) {
    const result = await db.select().from(schema.plans).where(eq(schema.plans.id, id));
    return result[0];
  },

  async findByProjectId(projectId: string) {
    return await db
      .select()
      .from(schema.plans)
      .where(eq(schema.plans.projectId, projectId))
      .orderBy(desc(schema.plans.updatedAt));
  },

  async update(id: string, data: Partial<schema.Plan>) {
    const result = await db
      .update(schema.plans)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(schema.plans.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(schema.plans).where(eq(schema.plans.id, id));
  },
};

// ============================================================================
// Room Operations
// ============================================================================

export const roomOperations = {
  async create(data: Omit<schema.NewRoom, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const room: schema.NewRoom = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.insert(schema.rooms).values(room).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.rooms);
  },

  async findById(id: string) {
    const result = await db.select().from(schema.rooms).where(eq(schema.rooms.id, id));
    return result[0];
  },

  async findByPlanId(planId: string) {
    return await db.select().from(schema.rooms).where(eq(schema.rooms.planId, planId));
  },

  async update(id: string, data: Partial<schema.Room>) {
    const result = await db
      .update(schema.rooms)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(schema.rooms.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(schema.rooms).where(eq(schema.rooms.id, id));
  },
};

// ============================================================================
// Wall Operations
// ============================================================================

export const wallOperations = {
  async create(data: Omit<schema.NewWall, 'id'>) {
    const wall: schema.NewWall = {
      id: uuidv4(),
      ...data,
    };

    const result = await db.insert(schema.walls).values(wall).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.walls);
  },

  async findById(id: string) {
    const result = await db.select().from(schema.walls).where(eq(schema.walls.id, id));
    return result[0];
  },

  async findByRoomId(roomId: string) {
    return await db.select().from(schema.walls).where(eq(schema.walls.roomId, roomId));
  },

  async update(id: string, data: Partial<schema.Wall>) {
    const result = await db
      .update(schema.walls)
      .set(data)
      .where(eq(schema.walls.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(schema.walls).where(eq(schema.walls.id, id));
  },

  async bulkCreate(walls: Omit<schema.NewWall, 'id'>[]) {
    const wallsWithIds = walls.map(w => ({
      id: uuidv4(),
      ...w,
    }));

    const result = await db.insert(schema.walls).values(wallsWithIds).returning();
    return result;
  },
};

// ============================================================================
// Placed Object Operations
// ============================================================================

export const placedObjectOperations = {
  async create(data: Omit<schema.NewPlacedObject, 'id' | 'createdAt'>) {
    const obj: schema.NewPlacedObject = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const result = await db.insert(schema.placedObjects).values(obj).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.placedObjects);
  },

  async findById(id: string) {
    const result = await db
      .select()
      .from(schema.placedObjects)
      .where(eq(schema.placedObjects.id, id));
    return result[0];
  },

  async findByPlanId(planId: string) {
    return await db
      .select()
      .from(schema.placedObjects)
      .where(eq(schema.placedObjects.planId, planId));
  },

  async findByRoomId(roomId: string) {
    return await db
      .select()
      .from(schema.placedObjects)
      .where(eq(schema.placedObjects.roomId, roomId));
  },

  async update(id: string, data: Partial<schema.PlacedObject>) {
    const result = await db
      .update(schema.placedObjects)
      .set(data)
      .where(eq(schema.placedObjects.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(schema.placedObjects).where(eq(schema.placedObjects.id, id));
  },

  async bulkDelete(ids: string[]) {
    for (const id of ids) {
      await this.delete(id);
    }
  },
};

// ============================================================================
// Export Operations
// ============================================================================

export const exportOperations = {
  async create(data: Omit<schema.NewExport, 'id' | 'createdAt'>) {
    const exportRecord: schema.NewExport = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const result = await db.insert(schema.exports).values(exportRecord).returning();
    return result[0];
  },

  async findAll() {
    return await db
      .select()
      .from(schema.exports)
      .orderBy(desc(schema.exports.createdAt));
  },

  async findById(id: string) {
    const result = await db.select().from(schema.exports).where(eq(schema.exports.id, id));
    return result[0];
  },

  async findByProjectId(projectId: string) {
    return await db
      .select()
      .from(schema.exports)
      .where(eq(schema.exports.projectId, projectId))
      .orderBy(desc(schema.exports.createdAt));
  },

  async findByPlanId(planId: string) {
    return await db
      .select()
      .from(schema.exports)
      .where(eq(schema.exports.planId, planId))
      .orderBy(desc(schema.exports.createdAt));
  },

  async delete(id: string) {
    await db.delete(schema.exports).where(eq(schema.exports.id, id));
  },
};

// ============================================================================
// Purchase Operations
// ============================================================================

export const purchaseOperations = {
  async create(data: Omit<schema.NewPurchase, 'id'>) {
    const purchase: schema.NewPurchase = {
      id: uuidv4(),
      ...data,
    };

    const result = await db.insert(schema.purchases).values(purchase).returning();
    return result[0];
  },

  async findAll() {
    return await db.select().from(schema.purchases);
  },

  async findActive() {
    return await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.isActive, true));
  },

  async findById(id: string) {
    const result = await db.select().from(schema.purchases).where(eq(schema.purchases.id, id));
    return result[0];
  },

  async findByProductId(productId: string) {
    return await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.productId, productId));
  },

  async deactivate(id: string) {
    await db
      .update(schema.purchases)
      .set({isActive: false})
      .where(eq(schema.purchases.id, id));
  },

  async checkProActive() {
    const activePurchases = await this.findActive();
    return activePurchases.some(p => p.productId === 'pro_unlock');
  },
};

// ============================================================================
// Aggregate Operations
// ============================================================================

export const aggregateOperations = {
  async getProjectWithPlans(projectId: string) {
    const project = await projectOperations.findById(projectId);
    if (!project) return null;

    const plans = await planOperations.findByProjectId(projectId);
    return {project, plans};
  },

  async getPlanWithDetails(planId: string) {
    const plan = await planOperations.findById(planId);
    if (!plan) return null;

    const rooms = await roomOperations.findByPlanId(planId);
    const objects = await placedObjectOperations.findByPlanId(planId);

    return {plan, rooms, objects};
  },

  async getRoomWithWalls(roomId: string) {
    const room = await roomOperations.findById(roomId);
    if (!room) return null;

    const walls = await wallOperations.findByRoomId(roomId);
    return {room, walls};
  },

  async getProjectStats(projectId: string) {
    const plans = await planOperations.findByProjectId(projectId);
    const exports = await exportOperations.findByProjectId(projectId);

    let totalRooms = 0;
    let totalObjects = 0;

    for (const plan of plans) {
      const rooms = await roomOperations.findByPlanId(plan.id);
      const objects = await placedObjectOperations.findByPlanId(plan.id);
      totalRooms += rooms.length;
      totalObjects += objects.length;
    }

    return {
      planCount: plans.length,
      roomCount: totalRooms,
      objectCount: totalObjects,
      exportCount: exports.length,
    };
  },
};
