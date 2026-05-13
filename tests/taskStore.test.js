const TaskStore = require('../src/taskStore');

describe('TaskStore', () => {
  let store;

  beforeEach(() => {
    store = new TaskStore();
  });

  // ── US-01: Add Task ──────────────────────────────────────────────────────────
  describe('addTask (US-01)', () => {
    test('creates a task with correct shape', () => {
      const task = store.addTask('Write unit tests');
      expect(task).toMatchObject({
        title: 'Write unit tests',
        status: 'open',
        completedAt: null,
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    test('assigns a unique ID to each task', () => {
      const t1 = store.addTask('Task One');
      const t2 = store.addTask('Task Two');
      expect(t1.id).not.toBe(t2.id);
    });

    test('trims whitespace from title', () => {
      const task = store.addTask('  padded title  ');
      expect(task.title).toBe('padded title');
    });

    test('throws when title is empty string', () => {
      expect(() => store.addTask('')).toThrow('non-empty string');
    });

    test('throws when title is only whitespace', () => {
      expect(() => store.addTask('   ')).toThrow('non-empty string');
    });

    test('throws when title is not a string', () => {
      expect(() => store.addTask(null)).toThrow('non-empty string');
      expect(() => store.addTask(42)).toThrow('non-empty string');
    });
  });

  // ── US-02: List Tasks ────────────────────────────────────────────────────────
  describe('listTasks (US-02)', () => {
    test('returns empty array when no tasks exist', () => {
      expect(store.listTasks()).toEqual([]);
    });

    test('returns all tasks sorted by createdAt', () => {
      store.addTask('First');
      store.addTask('Second');
      const tasks = store.listTasks();
      expect(tasks).toHaveLength(2);
      expect(new Date(tasks[0].createdAt) <= new Date(tasks[1].createdAt)).toBe(true);
    });

    test('returns copies, not references', () => {
      store.addTask('Immutable check');
      const [task] = store.listTasks();
      task.title = 'MUTATED';
      expect(store.listTasks()[0].title).toBe('Immutable check');
    });
  });

  // ── US-03: Complete Task ─────────────────────────────────────────────────────
  describe('completeTask (US-03)', () => {
    test('sets status to done and records completedAt', () => {
      const { id } = store.addTask('Deploy the app');
      const updated = store.completeTask(id);
      expect(updated.status).toBe('done');
      expect(updated.completedAt).not.toBeNull();
    });

    test('throws for unknown task ID', () => {
      expect(() => store.completeTask('nonexistent-id')).toThrow('Task not found');
    });
  });

  // ── US-04: Delete Task ───────────────────────────────────────────────────────
  describe('deleteTask (US-04)', () => {
    test('removes the task from the store', () => {
      const { id } = store.addTask('To be deleted');
      store.deleteTask(id);
      expect(store.listTasks()).toHaveLength(0);
    });

    test('returns confirmation object', () => {
      const { id } = store.addTask('Delete me');
      const result = store.deleteTask(id);
      expect(result).toEqual({ deleted: true, id });
    });

    test('throws for unknown task ID', () => {
      expect(() => store.deleteTask('ghost-id')).toThrow('Task not found');
    });
  });

  // ── US-05: Filter Tasks by Status ───────────────────────────────────────────
  describe('listTasks with status filter (US-05)', () => {
    beforeEach(() => {
      const t1 = store.addTask('Open task');
      const t2 = store.addTask('Done task');
      store.completeTask(t2.id);
    });

    test('filters to only open tasks', () => {
      const open = store.listTasks({ status: 'open' });
      expect(open).toHaveLength(1);
      expect(open[0].title).toBe('Open task');
    });

    test('filters to only done tasks', () => {
      const done = store.listTasks({ status: 'done' });
      expect(done).toHaveLength(1);
      expect(done[0].status).toBe('done');
    });

    test('throws on invalid status value', () => {
      expect(() => store.listTasks({ status: 'pending' })).toThrow("Status filter must be");
    });
  });
});
