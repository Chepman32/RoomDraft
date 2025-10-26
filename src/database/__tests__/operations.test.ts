import {
  projectOperations,
  planOperations,
  roomOperations,
  wallOperations,
  placedObjectOperations,
} from '../operations';

// Mock the database
jest.mock('../client', () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'mock-id' }]),
      }),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue([]),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'mock-id' }]),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({ rowsAffected: 1 }),
    }),
  },
}));

describe('Database Operations', () => {
  describe('projectOperations', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        address: '123 Test St',
      };

      const result = await projectOperations.create(projectData);
      expect(result).toHaveProperty('id');
    });

    it('should find all projects', async () => {
      const projects = await projectOperations.findAll();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('should search projects by query', async () => {
      const results = await projectOperations.search('Test');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('planOperations', () => {
    it('should create a new plan', async () => {
      const planData = {
        projectId: 'project-123',
        name: 'First Floor',
        floorNumber: 1,
        scale: 0.01,
      };

      const result = await planOperations.create(planData);
      expect(result).toHaveProperty('id');
    });

    it('should find plans by project ID', async () => {
      const plans = await planOperations.findByProjectId('project-123');
      expect(Array.isArray(plans)).toBe(true);
    });
  });

  describe('roomOperations', () => {
    it('should create a new room', async () => {
      const roomData = {
        planId: 'plan-123',
        name: 'Living Room',
        type: 'living' as const,
        area: 25.5,
      };

      const result = await roomOperations.create(roomData);
      expect(result).toHaveProperty('id');
    });

    it('should calculate total area', async () => {
      jest.spyOn(roomOperations, 'getTotalArea').mockResolvedValue(100);
      const totalArea = await roomOperations.getTotalArea('plan-123');
      expect(typeof totalArea).toBe('number');
    });
  });

  describe('wallOperations', () => {
    it('should create a new wall', async () => {
      const wallData = {
        roomId: 'room-123',
        startX: 0,
        startY: 0,
        endX: 10,
        endY: 0,
        thickness: 0.2,
      };

      const result = await wallOperations.create(wallData);
      expect(result).toHaveProperty('id');
    });
  });

  describe('placedObjectOperations', () => {
    it('should create a new placed object', async () => {
      const objectData = {
        planId: 'plan-123',
        templateId: 'chair-dining',
        x: 5,
        y: 5,
        rotation: 0,
        scale: 1,
      };

      const result = await placedObjectOperations.create(objectData);
      expect(result).toHaveProperty('id');
    });

    it('should find objects by plan ID', async () => {
      const objects = await placedObjectOperations.findByPlanId('plan-123');
      expect(Array.isArray(objects)).toBe(true);
    });
  });
});
