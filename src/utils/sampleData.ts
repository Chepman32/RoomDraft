/**
 * Sample Data Generator
 * Creates sample projects and plans for testing/demo
 */

import {v4 as uuidv4} from 'uuid';
import type {Project, Plan, Room, Wall} from '@types/index';

// ============================================================================
// Sample Projects
// ============================================================================

export const generateSampleProjects = (): Project[] => {
  const now = new Date().toISOString();

  return [
    {
      id: uuidv4(),
      title: 'Modern Apartment',
      description: 'Downtown 2-bedroom apartment renovation',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isPro: false,
    },
    {
      id: uuidv4(),
      title: 'Family House',
      description: '3-bedroom family home with backyard',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isPro: false,
    },
    {
      id: uuidv4(),
      title: 'Office Space',
      description: 'Open office floor plan for startup',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      isPro: true,
    },
  ];
};

// ============================================================================
// Sample Plans
// ============================================================================

export const generateSamplePlans = (projectId: string): Plan[] => {
  return [
    {
      id: uuidv4(),
      projectId,
      title: 'Ground Floor',
      scale: 0.01,
      width: 2000,
      height: 2000,
      captureMethod: 'lidar',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      projectId,
      title: 'Second Floor',
      scale: 0.01,
      width: 2000,
      height: 2000,
      captureMethod: 'ar',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

// ============================================================================
// Sample Rooms
// ============================================================================

export const generateSampleRooms = (planId: string): Room[] => {
  return [
    {
      id: uuidv4(),
      planId,
      name: 'Living Room',
      area: 25.5,
      perimeter: 20.0,
      walls: JSON.stringify([
        {
          id: uuidv4(),
          start: {x: 100, y: 100},
          end: {x: 600, y: 100},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 600, y: 100},
          end: {x: 600, y: 600},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 600, y: 600},
          end: {x: 100, y: 600},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 100, y: 600},
          end: {x: 100, y: 100},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
      ]) as any,
      color: '#2196F3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      planId,
      name: 'Kitchen',
      area: 12.0,
      perimeter: 14.0,
      walls: JSON.stringify([
        {
          id: uuidv4(),
          start: {x: 700, y: 100},
          end: {x: 1000, y: 100},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 1000, y: 100},
          end: {x: 1000, y: 500},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 1000, y: 500},
          end: {x: 700, y: 500},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 700, y: 500},
          end: {x: 700, y: 100},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
      ]) as any,
      color: '#4CAF50',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      planId,
      name: 'Bedroom',
      area: 15.0,
      perimeter: 16.0,
      walls: JSON.stringify([
        {
          id: uuidv4(),
          start: {x: 100, y: 700},
          end: {x: 500, y: 700},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
        {
          id: uuidv4(),
          start: {x: 500, y: 700},
          end: {x: 500, y: 1100},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 500, y: 1100},
          end: {x: 100, y: 1100},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
        {
          id: uuidv4(),
          start: {x: 100, y: 1100},
          end: {x: 100, y: 700},
          thickness: 0.2,
          height: 2.5,
          type: 'exterior',
        },
      ]) as any,
      color: '#FF9800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      planId,
      name: 'Bathroom',
      area: 6.0,
      perimeter: 10.0,
      walls: JSON.stringify([
        {
          id: uuidv4(),
          start: {x: 600, y: 700},
          end: {x: 800, y: 700},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
        {
          id: uuidv4(),
          start: {x: 800, y: 700},
          end: {x: 800, y: 1000},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
        {
          id: uuidv4(),
          start: {x: 800, y: 1000},
          end: {x: 600, y: 1000},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
        {
          id: uuidv4(),
          start: {x: 600, y: 1000},
          end: {x: 600, y: 700},
          thickness: 0.2,
          height: 2.5,
          type: 'interior',
        },
      ]) as any,
      color: '#9C27B0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// ============================================================================
// Database Seeder
// ============================================================================

export const seedDatabase = async () => {
  const {projectOperations, planOperations, roomOperations} = await import(
    '../database/operations'
  );

  try {
    // Create sample projects
    const projects = generateSampleProjects();
    for (const project of projects) {
      await projectOperations.create({
        title: project.title,
        description: project.description,
        isPro: project.isPro,
      });
    }

    // Create sample plans for first project
    if (projects.length > 0) {
      const plans = generateSamplePlans(projects[0].id);
      for (const plan of plans) {
        await planOperations.create({
          projectId: plan.projectId,
          title: plan.title,
          scale: plan.scale,
          width: plan.width,
          height: plan.height,
          captureMethod: plan.captureMethod,
        });
      }

      // Create sample rooms for first plan
      if (plans.length > 0) {
        const rooms = generateSampleRooms(plans[0].id);
        for (const room of rooms) {
          await roomOperations.create({
            planId: room.planId,
            name: room.name,
            area: room.area,
            perimeter: room.perimeter,
            walls: room.walls,
            color: room.color,
          });
        }
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};
