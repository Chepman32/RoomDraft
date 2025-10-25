/**
 * Projects Store - Zustand
 */

import {create} from 'zustand';
import {Project} from '@types/index';

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>(set => ({
  projects: [],
  selectedProjectId: null,
  isLoading: false,

  setProjects: projects => set({projects}),

  addProject: project =>
    set(state => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, updates) =>
    set(state => ({
      projects: state.projects.map(p => (p.id === id ? {...p, ...updates} : p)),
    })),

  deleteProject: id =>
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    })),

  selectProject: id => set({selectedProjectId: id}),

  setLoading: loading => set({isLoading: loading}),
}));
