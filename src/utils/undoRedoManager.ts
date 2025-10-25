/**
 * Undo/Redo Manager
 * Manages history for editor operations
 */

export type Action =
  | 'CREATE_WALL'
  | 'DELETE_WALL'
  | 'MOVE_WALL'
  | 'CREATE_ROOM'
  | 'DELETE_ROOM'
  | 'UPDATE_ROOM'
  | 'CREATE_OBJECT'
  | 'DELETE_OBJECT'
  | 'MOVE_OBJECT'
  | 'ROTATE_OBJECT'
  | 'SCALE_OBJECT';

export interface HistoryEntry<T = any> {
  action: Action;
  timestamp: number;
  before: T;
  after: T;
  entityType: 'wall' | 'room' | 'object';
  entityId: string;
}

export class UndoRedoManager {
  private history: HistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 100;

  // Add action to history
  addAction<T>(
    action: Action,
    entityType: 'wall' | 'room' | 'object',
    entityId: string,
    before: T,
    after: T,
  ): void {
    // Remove any actions after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new action
    const entry: HistoryEntry<T> = {
      action,
      timestamp: Date.now(),
      before,
      after,
      entityType,
      entityId,
    };

    this.history.push(entry);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  // Check if can undo
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  // Check if can redo
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  // Undo last action
  undo(): HistoryEntry | null {
    if (!this.canUndo()) return null;

    const entry = this.history[this.currentIndex];
    this.currentIndex--;

    return entry;
  }

  // Redo next action
  redo(): HistoryEntry | null {
    if (!this.canRedo()) return null;

    this.currentIndex++;
    const entry = this.history[this.currentIndex];

    return entry;
  }

  // Get current history index
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  // Get history size
  getHistorySize(): number {
    return this.history.length;
  }

  // Get all history
  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  // Clear history
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  // Get last action
  getLastAction(): HistoryEntry | null {
    if (this.currentIndex < 0) return null;
    return this.history[this.currentIndex];
  }

  // Set max history size
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;

    // Trim if necessary
    if (this.history.length > size) {
      const trimCount = this.history.length - size;
      this.history = this.history.slice(trimCount);
      this.currentIndex = Math.max(-1, this.currentIndex - trimCount);
    }
  }
}

export const undoRedoManager = new UndoRedoManager();
