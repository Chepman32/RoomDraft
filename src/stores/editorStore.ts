/**
 * Editor Store - Zustand
 */

import {create} from 'zustand';
import {EditorState, EditorMode, HistoryEntry, ClipboardData} from '@types/index';

interface EditorStoreState extends EditorState {
  setMode: (mode: EditorMode) => void;
  selectObjects: (ids: string[]) => void;
  selectRooms: (ids: string[]) => void;
  selectWalls: (ids: string[]) => void;
  clearSelection: () => void;
  copy: (data: ClipboardData) => void;
  paste: () => ClipboardData | null;
  undo: () => void;
  redo: () => void;
  addHistoryEntry: (entry: HistoryEntry) => void;
  toggleGrid: () => void;
  toggleMeasurements: () => void;
  toggleLabels: () => void;
  setGridSize: (size: number) => void;
  toggleGridSnap: () => void;
}

export const useEditorStore = create<EditorStoreState>(set => ({
  // Initial state
  mode: 'select',
  selectedObjectIds: [],
  selectedRoomIds: [],
  selectedWallIds: [],
  clipboard: null,
  history: [],
  historyIndex: -1,
  gridSnap: true,
  gridSize: 0.5, // 0.5 meters
  showGrid: true,
  showMeasurements: true,
  showLabels: true,

  // Actions
  setMode: mode => set({mode}),

  selectObjects: ids => set({selectedObjectIds: ids}),

  selectRooms: ids => set({selectedRoomIds: ids}),

  selectWalls: ids => set({selectedWallIds: ids}),

  clearSelection: () =>
    set({
      selectedObjectIds: [],
      selectedRoomIds: [],
      selectedWallIds: [],
    }),

  copy: data => set({clipboard: data}),

  paste: () => {
    let clipboardData: ClipboardData | null = null;
    set(state => {
      clipboardData = state.clipboard;
      return state;
    });
    return clipboardData;
  },

  undo: () =>
    set(state => {
      if (state.historyIndex > 0) {
        return {historyIndex: state.historyIndex - 1};
      }
      return state;
    }),

  redo: () =>
    set(state => {
      if (state.historyIndex < state.history.length - 1) {
        return {historyIndex: state.historyIndex + 1};
      }
      return state;
    }),

  addHistoryEntry: entry =>
    set(state => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(entry);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  toggleGrid: () => set(state => ({showGrid: !state.showGrid})),

  toggleMeasurements: () => set(state => ({showMeasurements: !state.showMeasurements})),

  toggleLabels: () => set(state => ({showLabels: !state.showLabels})),

  setGridSize: size => set({gridSize: size}),

  toggleGridSnap: () => set(state => ({gridSnap: !state.gridSnap})),
}));
