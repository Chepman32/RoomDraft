import { UndoRedoManager } from '../undoRedoManager';

describe('UndoRedoManager', () => {
  let manager: UndoRedoManager;

  beforeEach(() => {
    manager = new UndoRedoManager(50); // max 50 actions
  });

  it('should add an action to history', () => {
    manager.addAction(
      'create',
      'wall',
      'wall-1',
      null,
      { id: 'wall-1', startX: 0, startY: 0 }
    );

    expect(manager.canUndo()).toBe(true);
    expect(manager.canRedo()).toBe(false);
  });

  it('should undo an action', () => {
    const before = { id: 'wall-1', startX: 0 };
    const after = { id: 'wall-1', startX: 10 };

    manager.addAction('update', 'wall', 'wall-1', before, after);

    const undoEntry = manager.undo();

    expect(undoEntry).not.toBeNull();
    expect(undoEntry?.action).toBe('update');
    expect(undoEntry?.dataBefore).toEqual(before);
  });

  it('should redo an action', () => {
    const before = { id: 'wall-1', startX: 0 };
    const after = { id: 'wall-1', startX: 10 };

    manager.addAction('update', 'wall', 'wall-1', before, after);
    manager.undo();

    const redoEntry = manager.redo();

    expect(redoEntry).not.toBeNull();
    expect(redoEntry?.action).toBe('update');
    expect(redoEntry?.dataAfter).toEqual(after);
  });

  it('should clear redo stack when new action is added', () => {
    manager.addAction('create', 'wall', 'wall-1', null, { id: 'wall-1' });
    manager.addAction('create', 'wall', 'wall-2', null, { id: 'wall-2' });

    manager.undo();
    expect(manager.canRedo()).toBe(true);

    manager.addAction('create', 'wall', 'wall-3', null, { id: 'wall-3' });
    expect(manager.canRedo()).toBe(false);
  });

  it('should respect max history size', () => {
    const smallManager = new UndoRedoManager(3);

    smallManager.addAction('create', 'wall', 'wall-1', null, {});
    smallManager.addAction('create', 'wall', 'wall-2', null, {});
    smallManager.addAction('create', 'wall', 'wall-3', null, {});
    smallManager.addAction('create', 'wall', 'wall-4', null, {});

    let undoCount = 0;
    while (smallManager.canUndo()) {
      smallManager.undo();
      undoCount++;
    }

    expect(undoCount).toBe(3); // Should only keep last 3
  });

  it('should clear all history', () => {
    manager.addAction('create', 'wall', 'wall-1', null, {});
    manager.addAction('create', 'wall', 'wall-2', null, {});

    manager.clear();

    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  it('should get history summary', () => {
    manager.addAction('create', 'wall', 'wall-1', null, {});
    manager.addAction('update', 'wall', 'wall-1', {}, {});
    manager.addAction('delete', 'wall', 'wall-1', {}, null);

    const summary = manager.getHistorySummary();

    expect(summary.undoCount).toBe(3);
    expect(summary.redoCount).toBe(0);
    expect(summary.currentIndex).toBe(2);
  });
});
